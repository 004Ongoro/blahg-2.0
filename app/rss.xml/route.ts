import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getBaseUrl } from '@/lib/utils'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export const revalidate = 3600

export async function GET() {
  await dbConnect()
  const posts = await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()

  const baseUrl = getBaseUrl()

  const items = await Promise.all(
    posts.map(async (post: any) => {
      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(post.content)

      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${baseUrl}/post/${post.slug}</link>
          <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
          <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt}]]></description>
          <content:encoded><![CDATA[${String(htmlContent)}]]></content:encoded>
        </item>
      `
    })
  )

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>George Ongoro Blog</title>
    <link>${baseUrl}</link>
    <description>Tech insights and coding journey</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join('')}
  </channel>
</rss>`.trim()

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}