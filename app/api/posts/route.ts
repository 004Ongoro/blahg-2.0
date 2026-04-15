// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getSession } from '@/lib/auth'

/**
 * Utility to generate a URL-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await req.json()
    const { title, content, excerpt, coverImage, tags, published } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Ensure slug exists before creation
    const slug = body.slug || generateSlug(title)

    // Check for duplicate slug
    const existingPost = await Post.findOne({ slug })
    const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug

    const post = await Post.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      slug: finalSlug,
      coverImage,
      tags: tags || [],
      published: published ?? false,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create post' }, 
      { status: 500 }
    )
  }
}