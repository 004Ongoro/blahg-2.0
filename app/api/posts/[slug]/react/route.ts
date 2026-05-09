import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params
    const { type } = await request.json()

    if (!['like', 'mindblown', 'rocket'].includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Convert Map to plain object for response
    const reactions = Object.fromEntries(post.reactions || new Map())

    return NextResponse.json({ reactions })
  } catch (error) {
    console.error('Error adding reaction:', error)
    return NextResponse.json(
      { error: 'Failed to add reaction' },
      { status: 500 }
    )
  }
}
