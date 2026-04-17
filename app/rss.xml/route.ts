import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const revalidate = 86400

export async function GET() {
  await dbConnect()
  const posts = await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.ongoro.top'

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>George Ongoro Blog</title>
      <link>${baseUrl}</link>
      <description>Tech insights and coding journey</description>
      <language>en-us</language>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
      ${posts
        .map((post: any) => `
          <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${baseUrl}/post/${post.slug}</link>
            <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
            <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
            <description><![CDATA[${post.excerpt}]]></description>
          </item>
        `).join('')}
    </channel>
  </rss>`

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}