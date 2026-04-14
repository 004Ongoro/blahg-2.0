import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getSession } from '@/lib/auth'

// GET all posts (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const published = searchParams.get('published')

    const query: Record<string, unknown> = {}
    
    // Only show published posts for public access
    if (published !== 'all') {
      query.published = true
    }
    
    if (tag) {
      query.tags = tag
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .select('-content')
      .lean()

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    console.log('[v0] Session check:', session ? 'authenticated' : 'no session')
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    console.log('[v0] Database connected')

    const body = await request.json()
    const { title, content, excerpt, tags, published } = body
    console.log('[v0] Creating post with title:', title)

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      )
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      tags: tags || [],
      published: published ?? false,
    })
    console.log('[v0] Post created successfully:', post._id)

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating post:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    )
  }
}
