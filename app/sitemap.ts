import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import NewsletterIssue from '@/models/NewsletterIssue'
import Bookmark from '@/models/Bookmark'
import { getBaseUrl } from '@/lib/utils'

export type SitemapId = 'pages' | 'posts' | 'notes' | 'series' | 'newsletter' | 'bookmarks'

/**
 * Generate sub-sitemap IDs for Next.js App Router multi-sitemap architecture.
 * Next.js automatically creates a master Sitemap Index at /sitemap.xml that references
 * each of these individual sub-sitemaps at /sitemap/[id].xml.
 */
export async function generateSitemaps(): Promise<Array<{ id: SitemapId }>> {
  return [
    { id: 'pages' },
    { id: 'posts' },
    { id: 'notes' },
    { id: 'series' },
    { id: 'newsletter' },
    { id: 'bookmarks' },
  ]
}

interface SitemapProps {
  id: Promise<string> | string
}

export default async function sitemap(props?: SitemapProps): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  const rawId = props?.id
  const resolvedId = (rawId instanceof Promise ? await rawId : rawId) as SitemapId | undefined

  switch (resolvedId) {
    case 'pages':
      return getStaticPagesSitemap(baseUrl)
    case 'posts':
      return getPostsSitemap(baseUrl)
    case 'notes':
      return getNotesSitemap(baseUrl)
    case 'series':
      return getSeriesSitemap(baseUrl)
    case 'newsletter':
      return getNewsletterSitemap(baseUrl)
    case 'bookmarks':
      return getBookmarksSitemap(baseUrl)
    default:
      // Fallback: If accessed without an id, return all routes (or static routes)
      return getStaticPagesSitemap(baseUrl)
  }
}

/**
 * 1. Core static and hub pages
 */
function getStaticPagesSitemap(baseUrl: string): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter/archive`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}

/**
 * 2. In-depth technical articles and guides
 */
async function getPostsSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
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

    return posts.map((post: any) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    return []
  }
}

/**
 * 3. Quick technical notes and field observations
 */
async function getNotesSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
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

    return notes.map((note: any) => ({
      url: `${baseUrl}/note/${note.slug}`,
      lastModified: new Date(note.updatedAt || note.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching notes for sitemap:', error)
    return []
  }
}

/**
 * 4. Curated sequential technical series
 */
async function getSeriesSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
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

    return series.map((s: any) => ({
      url: `${baseUrl}/series/${encodeURIComponent(s._id)}`,
      lastModified: new Date(s.latestUpdate || s.latestCreated || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching series for sitemap:', error)
    return []
  }
}

/**
 * 5. Weekly dispatches & newsletter archives
 */
async function getNewsletterSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await dbConnect()
    const issues = await NewsletterIssue.find({ published: true, isDraft: { $ne: true } })
      .sort({ updatedAt: -1 })
      .select('slug updatedAt createdAt')
      .lean()

    return issues.map((issue: any) => ({
      url: `${baseUrl}/newsletter/archive/${issue.slug}`,
      lastModified: new Date(issue.updatedAt || issue.createdAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching newsletter issues for sitemap:', error)
    return []
  }
}

/**
 * 6. Curated developer resource bookmarks
 */
async function getBookmarksSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await dbConnect()
    const bookmarks = await Bookmark.find({
      isDraft: { $ne: true },
      url: { $not: /draft\.local/i },
    })
      .sort({ updatedAt: -1 })
      .select('_id updatedAt createdAt')
      .lean()

    return bookmarks.map((b: any) => ({
      url: `${baseUrl}/bookmarks/${b._id.toString()}`,
      lastModified: new Date(b.updatedAt || b.createdAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching bookmarks for sitemap:', error)
    return []
  }
}