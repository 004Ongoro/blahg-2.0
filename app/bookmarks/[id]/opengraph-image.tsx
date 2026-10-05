import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Bookmark from '@/models/Bookmark'
import { OgCard } from '@/components/OgCard'
import { getOgFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Bookmarks'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fonts = await getOgFonts()

  try {
    await dbConnect()
    const bookmark = await Bookmark.findById(id)
      .select('title category description url createdAt')
      .lean()

    const title = bookmark?.title || 'Curated Bookmark'
    const excerpt = bookmark?.description || bookmark?.url || ''
    const tags = bookmark?.category ? [bookmark.category] : ['bookmark']
    const date = bookmark?.createdAt

    return new ImageResponse(
      <OgCard
        title={title}
        excerpt={excerpt}
        tags={tags}
        date={date}
        authorName="George Ongoro"
        badgeText="BOOKMARK"
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
      <OgCard title="Curated Bookmarks" tags={['bookmarks']} badgeText="BOOKMARK" />,
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
