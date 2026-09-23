import { ImageResponse } from 'next/og'
import { OgCard } from '@/components/OgCard'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Series'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const seriesName = decodeURIComponent(name)

  return new ImageResponse(
    <OgCard title={`Series: ${seriesName}`} tags={['series', seriesName]} authorName="George Ongoro" />,
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
