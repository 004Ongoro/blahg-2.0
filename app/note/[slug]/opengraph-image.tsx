import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { OgCard } from '@/components/OgCard'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Note'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await dbConnect()
    const note = await Post.findOne({ slug, published: true }).select('title tags readTime isGuest authorName').lean()

    const title = note?.title || 'George Ongoro Note'
    const tags = (note?.tags as string[]) || []
    const authorName = note?.isGuest ? (note?.authorName || 'Guest Author') : 'George Ongoro'

    return new ImageResponse(
      <OgCard title={title} tags={tags} readTime={1} authorName={authorName} />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      <OgCard title="George Ongoro Note" />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  }
}
