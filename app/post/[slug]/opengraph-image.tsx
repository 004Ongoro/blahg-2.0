import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { OgCard } from '@/components/OgCard'
import { getOgFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Blog'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fonts = await getOgFonts()

  try {
    await dbConnect()
    const post = await Post.findOne({ slug, published: true })
      .select('title excerpt tags readTime createdAt isGuest authorName')
      .lean()

    const title = post?.title || 'George Ongoro Blog'
    const excerpt = post?.excerpt || ''
    const tags = (post?.tags as string[]) || []
    const readTime = post?.readTime
    const date = post?.createdAt
    const authorName = post?.isGuest ? (post?.authorName || 'Guest Author') : 'George Ongoro'

    return new ImageResponse(
      <OgCard
        title={title}
        excerpt={excerpt}
        tags={tags}
        readTime={readTime}
        date={date}
        authorName={authorName}
        badgeText="ARTICLE"
      />,
      {
        ...size,
        fonts,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      <OgCard title="George Ongoro Blog" badgeText="ARTICLE" />,
      {
        ...size,
        fonts,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  }
}
