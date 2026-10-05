import { ImageResponse } from 'next/og'
import { OgCard } from '@/components/OgCard'
import { getOgFonts } from '@/lib/og-fonts'

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
  const fonts = await getOgFonts()

  return new ImageResponse(
    <OgCard
      title={`Series: ${seriesName}`}
      excerpt={`A curated multi-part article series exploring ${seriesName} and practical software engineering implementations.`}
      tags={['series', seriesName]}
      authorName="George Ongoro"
      badgeText="ARTICLE SERIES"
    />,
    {
      ...size,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
