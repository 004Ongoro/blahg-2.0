import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import Bookmark from '@/models/Bookmark'
import { getBaseUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  let postUrls: MetadataRoute.Sitemap = []
  let bookmarkUrls: MetadataRoute.Sitemap = []

  try {
    // Fetch all published posts for the sitemap
    await dbConnect()
    const posts = await Post.find({ published: true, isDraft: { $ne: true } })
      .select('slug updatedAt createdAt')
      .lean()

    postUrls = posts.map((post: any) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  try {
    // Fetch all bookmarks for the sitemap
    await dbConnect()
    const bookmarks = await Bookmark.find({ isDraft: { $ne: true } })
      .select('_id updatedAt createdAt')
      .lean()

    bookmarkUrls = bookmarks.map((bookmark: any) => ({
      url: `${baseUrl}/bookmarks/${bookmark._id.toString()}`,
      lastModified: new Date(bookmark.updatedAt || bookmark.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch (error) {
    console.error('Error fetching bookmarks for sitemap:', error)
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
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  return [...staticRoutes, ...postUrls, ...bookmarkUrls]
}