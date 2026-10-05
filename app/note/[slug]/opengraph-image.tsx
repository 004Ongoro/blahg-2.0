import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { OgCard } from '@/components/OgCard'
import { getOgFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Note'
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
    const note = await Post.findOne({ slug, published: true })
      .select('title excerpt content tags readTime createdAt isGuest authorName')
      .lean()

    const title = note?.title || 'George Ongoro Note'
    const excerpt = note?.excerpt || (note?.content ? note.content.slice(0, 160).replace(/[#*`_~]/g, '') : '')
    const tags = (note?.tags as string[]) || []
    const authorName = note?.isGuest ? (note?.authorName || 'Guest Author') : 'George Ongoro'
    const date = note?.createdAt

    return new ImageResponse(
      <OgCard
        title={title}
        excerpt={excerpt}
        tags={tags}
        readTime={1}
        date={date}
        authorName={authorName}
        badgeText="NOTE"
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
      <OgCard title="George Ongoro Note" badgeText="NOTE" />,
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
