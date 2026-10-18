import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import NewsletterIssue from '@/models/NewsletterIssue'
import Bookmark from '@/models/Bookmark'
import { getBaseUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 hour revalidation

interface SitemapItem {
  url: string
  lastModified?: string | Date
  changeFrequency?: string
  priority?: number
}

function buildXmlUrlSet(items: SitemapItem[]): string {
  const urlsXml = items
    .map((item) => {
      const lastmod = item.lastModified
        ? `\n    <lastmod>${new Date(item.lastModified).toISOString()}</lastmod>`
        : ''
      const changefreq = item.changeFrequency
        ? `\n    <changefreq>${item.changeFrequency}</changefreq>`
        : ''
      const priority = item.priority !== undefined
        ? `\n    <priority>${item.priority.toFixed(1)}</priority>`
        : ''
      return `  <url>\n    <loc>${item.url}</loc>${lastmod}${changefreq}${priority}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const id = slug.replace(/\.xml$/, '').toLowerCase()
  const baseUrl = getBaseUrl()

  let items: SitemapItem[] = []

  switch (id) {
    case 'pages': {
      const now = new Date()
      items = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/now`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/archive`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/series`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/tags`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/bookmarks`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/newsletter/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/guestbook`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
      ]
      break
    }

    case 'posts': {
      try {
        await dbConnect()
        const posts = await Post.find({
          published: true,
          isDraft: { $ne: true },
          type: { $ne: 'note' },
        })
          .sort({ updatedAt: -1 })
          .select('slug updatedAt createdAt')
          .lean()

        items = posts.map((post: any) => ({
          url: `${baseUrl}/post/${post.slug}`,
          lastModified: post.updatedAt || post.createdAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        }))
      } catch (e) {
        console.error('Error fetching posts for sitemap:', e)
      }
      break
    }

    case 'notes': {
      try {
        await dbConnect()
        const notes = await Post.find({
          published: true,
          isDraft: { $ne: true },
          type: 'note',
        })
          .sort({ updatedAt: -1 })
          .select('slug updatedAt createdAt')
          .lean()

        items = notes.map((note: any) => ({
          url: `${baseUrl}/note/${note.slug}`,
          lastModified: note.updatedAt || note.createdAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
      } catch (e) {
        console.error('Error fetching notes for sitemap:', e)
      }
      break
    }

    case 'series': {
      try {
        await dbConnect()
        const series = await Post.aggregate([
          { $match: { published: true, isDraft: { $ne: true }, series: { $ne: null, $exists: true } } },
          {
            $group: {
              _id: '$series',
              latestUpdate: { $max: '$updatedAt' },
              latestCreated: { $max: '$createdAt' },
            },
          },
        ])

        items = series.map((s: any) => ({
          url: `${baseUrl}/series/${encodeURIComponent(s._id)}`,
          lastModified: s.latestUpdate || s.latestCreated || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }))
      } catch (e) {
        console.error('Error fetching series for sitemap:', e)
      }
      break
    }

    case 'newsletter': {
      try {
        await dbConnect()
        const issues = await NewsletterIssue.find({ published: true, isDraft: { $ne: true } })
          .sort({ updatedAt: -1 })
          .select('slug updatedAt createdAt')
          .lean()

        items = issues.map((issue: any) => ({
          url: `${baseUrl}/newsletter/archive/${issue.slug}`,
          lastModified: issue.updatedAt || issue.createdAt || new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        }))
      } catch (e) {
        console.error('Error fetching newsletter issues for sitemap:', e)
      }
      break
    }

    case 'bookmarks': {
      try {
        await dbConnect()
        const bookmarks = await Bookmark.find({
          isDraft: { $ne: true },
          url: { $not: /draft\.local/i },
        })
          .sort({ updatedAt: -1 })
          .select('_id updatedAt createdAt')
          .lean()

        items = bookmarks.map((b: any) => ({
          url: `${baseUrl}/bookmarks/${b._id.toString()}`,
          lastModified: b.updatedAt || b.createdAt || new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        }))
      } catch (e) {
        console.error('Error fetching bookmarks for sitemap:', e)
      }
      break
    }

    default:
      return new NextResponse('Sitemap not found', { status: 404 })
  }

  const xml = buildXmlUrlSet(items)

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
