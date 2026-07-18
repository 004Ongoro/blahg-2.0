import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import Bookmark from '@/models/Bookmark'
import { getBaseUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  let postUrls: any[] = []
  let bookmarkUrls: any[] = []

  try {
    // Fetch all published posts for the sitemap
    await dbConnect()
    const posts = await Post.find({ published: true }).select('slug updatedAt').lean()

    postUrls = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching posts for sitemap, returning static routes only:', error)
  }

  try {
    // Fetch all bookmarks for the sitemap
    await dbConnect()
    const bookmarks = await Bookmark.find({}).select('_id updatedAt').lean()

    bookmarkUrls = bookmarks.map((bookmark) => ({
      url: `${baseUrl}/bookmarks/${bookmark._id.toString()}`,
      lastModified: bookmark.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch (error) {
    console.error('Error fetching bookmarks for sitemap:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...postUrls,
    ...bookmarkUrls,
  ]
}