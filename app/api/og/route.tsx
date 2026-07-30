import { ImageResponse } from 'next/og'
import { OgCard } from '@/components/OgCard'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'George Ongoro Blog'
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const readTime = searchParams.get('readTime')

    return new ImageResponse(
      <OgCard title={title} tags={tags} readTime={readTime || undefined} />,
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 })
  }
}