import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/setup'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap/pages.xml`,
      `${baseUrl}/sitemap/posts.xml`,
      `${baseUrl}/sitemap/notes.xml`,
      `${baseUrl}/sitemap/series.xml`,
      `${baseUrl}/sitemap/newsletter.xml`,
      `${baseUrl}/sitemap/bookmarks.xml`,
    ],
  }
}
