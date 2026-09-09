import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getSession } from '@/lib/auth'

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export const revalidate = 3600

export async function GET() {
  try {
    await dbConnect()
    const posts = await Post.find({ published: true, isDraft: { $ne: true } })
      .sort({ createdAt: -1 })
      .select('title slug tags excerpt views')
      .lean()
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Fetch posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await req.json()
    const { title, content, excerpt, coverImage, tags, published, series, seriesOrder, isDraft, draftSlug } = body

    if (isDraft) {
      const draftTitle = title || 'Untitled Post Draft'
      const draftContent = content || ''
      const slug = draftSlug || body.slug || `${generateSlug(draftTitle)}-${Date.now()}`

      let post = await Post.findOne({ slug })
      if (post) {
        post = await Post.findOneAndUpdate(
          { slug },
          {
            title: draftTitle,
            content: draftContent,
            excerpt: excerpt || draftContent.substring(0, 150),
            coverImage,
            tags: tags || [],
            published: false,
            isDraft: true,
            series,
            seriesOrder: seriesOrder || 0,
            updatedAt: new Date(),
          },
          { new: true }
        )
      } else {
        const readTime = calculateReadTime(draftContent)
        post = await Post.create({
          title: draftTitle,
          content: draftContent,
          excerpt: excerpt || draftContent.substring(0, 150),
          slug,
          coverImage,
          tags: tags || [],
          published: false,
          isDraft: true,
          readTime,
          series,
          seriesOrder: seriesOrder || 0,
        })
      }

      revalidatePath('/admin')
      return NextResponse.json(post, { status: 200 })
    }

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Clean up temporary draft post if draftSlug was passed and differs from target slug
    if (draftSlug && draftSlug !== body.slug) {
      try {
        await Post.findOneAndDelete({ slug: draftSlug, isDraft: true })
      } catch (e) {
        console.error('Failed to clean up post draft:', e)
      }
    }

    const slug = body.slug || generateSlug(title)
    const existingPost = await Post.findOne({ slug })
    let finalSlug = slug

    if (existingPost) {
      if (existingPost.isDraft) {
        // Overwrite/convert existing draft post
        await Post.findOneAndDelete({ slug })
      } else if (!draftSlug) {
        finalSlug = `${slug}-${Date.now()}`
      }
    }

    const readTime = calculateReadTime(content)

    const post = await Post.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      slug: finalSlug,
      coverImage,
      tags: tags || [],
      published: published ?? true,
      isDraft: false,
      readTime,
      series,
      seriesOrder: seriesOrder || 0,
    })

    revalidatePath('/admin')
    // If the post is published, clear the cache for the homepage and tags
    if (post.published) {
      // revalidate
      revalidatePath('/')
      revalidatePath('/archive')
      revalidatePath('/tags')
      tags?.forEach((tag: string) => revalidatePath(`/tags/${tag}`))
      if (series) {
        revalidatePath('/series')
        revalidatePath(`/series/${series}`)
      }
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create post' }, 
      { status: 500 }
    )
  }
}