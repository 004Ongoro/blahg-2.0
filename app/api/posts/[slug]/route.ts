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
          from: 'Uplink Console <uplink@geohack.top>',
          to: post.authorEmail,
          subject: `Transmission Approved: "${post.title}"`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Transmission Approved</title>
            </head>
            <body style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #374151; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; padding: 32px;">
                <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
                  <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
                    Transmission Approved
                  </h1>
                </div>
                <p style="font-size: 16px; line-height: 1.65; color: #334155; margin-top: 0; margin-bottom: 16px;">Hello ${post.authorName || 'Guest Writer'},</p>
                <p style="font-size: 16px; line-height: 1.65; color: #334155; margin-bottom: 16px;">Your log transmission <strong>"${post.title}"</strong> has been approved and is now live on the public network!</p>
                <p style="font-size: 16px; line-height: 1.65; color: #334155; margin-bottom: 24px;">You can view the published entry here:</p>
                <div style="margin-bottom: 32px;">
                  <a href="https://geohack.top/post/${post.slug}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 6px;">View Published Entry &rarr;</a>
                </div>
                <div style="padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: left;">
                  <p style="margin: 0; color: #94a3b8; font-size: 12px;">CORE_UPLINK_SYSTEM v2.0 // geohack.top</p>
                </div>
              </div>
            </body>
            </html>
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
