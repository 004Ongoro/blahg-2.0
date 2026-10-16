import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import NewsletterIssue from '@/models/NewsletterIssue'
import { getBaseUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  let postUrls: MetadataRoute.Sitemap = []
  let seriesUrls: MetadataRoute.Sitemap = []
  let newsletterUrls: MetadataRoute.Sitemap = []

  try {
    // Fetch all published posts and notes for the sitemap
    await dbConnect()
    const posts = await Post.find({ published: true, isDraft: { $ne: true } })
      .select('slug type updatedAt createdAt')
      .lean()

    postUrls = posts.map((post: any) => ({
      url: post.type === 'note' ? `${baseUrl}/note/${post.slug}` : `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: post.type === 'note' ? 0.7 : 0.9,
    }))
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  try {
    // Fetch distinct series for the sitemap
    await dbConnect()
    const series = await Post.aggregate([
      { $match: { published: true, isDraft: { $ne: true }, series: { $ne: null, $exists: true } } },
      {
        $group: {
          _id: '$series',
          latestUpdate: { $max: '$updatedAt' },
          latestCreated: { $max: '$createdAt' }
        }
      }
    ])

    seriesUrls = series.map((s: any) => ({
      url: `${baseUrl}/series/${encodeURIComponent(s._id)}`,
      lastModified: new Date(s.latestUpdate || s.latestCreated || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching series for sitemap:', error)
  }

  try {
    // Fetch newsletter issues for the sitemap
    await dbConnect()
    const issues = await NewsletterIssue.find({ published: true, isDraft: { $ne: true } })
      .select('slug updatedAt createdAt')
      .lean()

    newsletterUrls = issues.map((issue: any) => ({
      url: `${baseUrl}/newsletter/archive/${issue.slug}`,
      lastModified: new Date(issue.updatedAt || issue.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching newsletter issues for sitemap:', error)
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  return [...staticRoutes, ...postUrls, ...seriesUrls, ...newsletterUrls]
}