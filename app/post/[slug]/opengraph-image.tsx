import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { OgCard } from '@/components/OgCard'

export const runtime = 'nodejs'

export const alt = 'Ongoro Blog'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await dbConnect()
    const post = await Post.findOne({ slug, published: true }).select('title tags readTime').lean()

    const title = post?.title || 'Ongoro Blog'
    const tags = (post?.tags as string[]) || []
    const readTime = post?.readTime

    return new ImageResponse(
      <OgCard title={title} tags={tags} readTime={readTime} />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      <OgCard title="Ongoro Blog" />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  }
}
