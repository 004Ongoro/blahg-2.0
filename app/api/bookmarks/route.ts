import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import Bookmark from '@/models/Bookmark'
import { getSession } from '@/lib/auth'

export const revalidate = 60 // Cache GET for 60 seconds

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const query: any = {}
    if (category && category !== 'all') {
      query.category = category
    }

    const bookmarks = await Bookmark.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Fetch bookmarks error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()
    const { title, url, description, category, tags } = body

    if (!title || !url || !description) {
      return NextResponse.json({ error: 'Title, URL, and description are required' }, { status: 400 })
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      description,
      category: category || 'other',
      tags: tags || [],
    })

    revalidatePath('/bookmarks')
    return NextResponse.json(bookmark, { status: 201 })
  } catch (error: any) {
    console.error('Bookmark creation error:', error)
    if (error.code === 11000) {
      return NextResponse.json({ error: 'This URL is already bookmarked' }, { status: 400 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Bookmark ID is required' }, { status: 400 })
    }

    await dbConnect()
    const deleted = await Bookmark.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
    }

    revalidatePath('/bookmarks')
    return NextResponse.json({ message: 'Bookmark deleted successfully' })
  } catch (error: any) {
    console.error('Bookmark deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
