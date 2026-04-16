import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.ongoro.top'

  // Fetch all published posts for the sitemap
  await dbConnect()
  const posts = await Post.find({ published: true }).select('slug updatedAt').lean()

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...postUrls,
  ]
}