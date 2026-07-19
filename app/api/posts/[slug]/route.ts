import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getSession } from '@/lib/auth'
import { Resend } from 'resend'

// GET single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params

    const post = await Post.findOne({ slug }).lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { slug } = await params
    const body = await request.json()

    // Find existing post to check if its published status changed
    const existingPost = await Post.findOne({ slug })

    const post = await Post.findOneAndUpdate(
      { slug },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // If a guest post has been newly published, notify the author
    if (
      existingPost &&
      !existingPost.published &&
      post.published &&
      post.isGuest &&
      post.authorEmail
    ) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Uplink Console <uplink@deepread.website>',
          to: post.authorEmail,
          subject: `Transmission Approved: "${post.title}"`,
          html: `
            <div style="font-family: monospace; padding: 20px; background-color: #efd6ac; color: #04151f; border: 3px solid #04151f; max-width: 600px;">
              <h2 style="text-transform: uppercase; border-bottom: 2px solid #04151f; padding-bottom: 8px; color: #c44900;">Uplink Approved</h2>
              <p>Hello ${post.authorName || 'Guest Writer'},</p>
              <p>Your log transmission <strong>"${post.title}"</strong> has been approved by the core console and is now live on the public net!</p>
              <p>You can view the published entry here:</p>
              <p><a href="https://geohack.top/post/${post.slug}" style="color: #c44900; font-weight: bold; text-decoration: underline;">https://geohack.top/post/${post.slug}</a></p>
              <br/>
              <p style="opacity: 0.6; font-size: 10px;">CORE_UPLINK_SYSTEM v2.0</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send approval email notification:', emailError)
      }
    }

    // Clear caches
    revalidatePath('/')
    revalidatePath('/archive')
    revalidatePath(`/post/${slug}`) // Old slug
    if (post.slug !== slug) {
      revalidatePath(`/post/${post.slug}`) // New slug
    }
    
    if (post.tags) {
      revalidatePath('/tags')
      post.tags.forEach((tag: string) => revalidatePath(`/tags/${tag}`))
    }
    if (post.series) {
      revalidatePath('/series')
      revalidatePath(`/series/${post.series}`)
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { slug } = await params

    const post = await Post.findOneAndDelete({ slug })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Clear caches
    revalidatePath('/')
    revalidatePath('/archive')
    revalidatePath(`/post/${slug}`)
    if (post.tags) {
      revalidatePath('/tags')
      post.tags.forEach((tag: string) => revalidatePath(`/tags/${tag}`))
    }
    if (post.series) {
      revalidatePath('/series')
      revalidatePath(`/series/${post.series}`)
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
