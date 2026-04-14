import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

// GET all unique tags with post counts
export async function GET() {
  try {
    await dbConnect()

    const tags = await Post.aggregate([
      { $match: { published: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    const formattedTags = tags.map((tag) => ({
      name: tag._id,
      count: tag.count,
    }))

    return NextResponse.json(formattedTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}
