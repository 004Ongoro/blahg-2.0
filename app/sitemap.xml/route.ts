import { NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const baseUrl = getBaseUrl()

  const sitemaps = [
    `${baseUrl}/sitemap/pages.xml`,
    `${baseUrl}/sitemap/posts.xml`,
    `${baseUrl}/sitemap/notes.xml`,
    `${baseUrl}/sitemap/series.xml`,
    `${baseUrl}/sitemap/newsletter.xml`,
    `${baseUrl}/sitemap/bookmarks.xml`,
  ]

  const now = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
