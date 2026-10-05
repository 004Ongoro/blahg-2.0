import { ImageResponse } from 'next/og'
import { OgCard } from '@/components/OgCard'
import { getOgFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'George Ongoro Blog'
    const excerpt = searchParams.get('excerpt') || undefined
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const readTime = searchParams.get('readTime') || undefined
    const date = searchParams.get('date') || undefined
    const author = searchParams.get('author') || 'George Ongoro'
    const badge = searchParams.get('badge') || undefined

    const fonts = await getOgFonts()

    return new ImageResponse(
      <OgCard
        title={title}
        excerpt={excerpt}
        tags={tags}
        readTime={readTime}
        date={date}
        authorName={author}
        badgeText={badge}
      />,
      {
        width: 1200,
        height: 630,
        fonts,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Netlify-Vary': 'query',
          'Vary': 'Accept-Encoding, query',
        },
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}