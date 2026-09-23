import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Bookmark from '@/models/Bookmark'
import { OgCard } from '@/components/OgCard'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Bookmarks'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    await dbConnect()
    const bookmark = await Bookmark.findById(id).select('title category').lean()

    const title = bookmark?.title || 'Bookmarks'
    const tags = bookmark?.category ? [bookmark.category] : ['bookmark']

    return new ImageResponse(
      <OgCard title={title} tags={tags} authorName="George Ongoro" />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      <OgCard title="Bookmarks" tags={['bookmarks']} />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  }
}
