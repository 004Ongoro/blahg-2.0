import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import Activity from '@/models/Activity'
import { getSession } from '@/lib/auth'

export const revalidate = 60 // Cache GET for 60 seconds

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Fetch activities error:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
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
    const { content, category, emoji } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const activity = await Activity.create({
      content,
      category: category || 'general',
      emoji: emoji || '📍',
    })

    // On-demand revalidation to regenerate the static /now page instantly
    revalidatePath('/now')
    
    return NextResponse.json(activity, { status: 201 })
  } catch (error: any) {
    console.error('Activity creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create activity' },
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
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 })
    }

    await dbConnect()
    const deleted = await Activity.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    // Purge the cached public /now page
    revalidatePath('/now')

    return NextResponse.json({ message: 'Activity deleted successfully' })
  } catch (error: any) {
    console.error('Activity deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete activity' },
      { status: 500 }
    )
  }
}
