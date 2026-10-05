import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { OgCard } from '@/components/OgCard'
import { getOgFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'

export const alt = 'Newsletter Issue'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fonts = await getOgFonts()

  try {
    await dbConnect()
    const issue = await NewsletterIssue.findOne({ slug, published: true })
      .select('subject content createdAt')
      .lean()

    const title = issue?.subject || 'Newsletter Dispatch'
    const excerpt = issue?.content ? issue.content.slice(0, 160).replace(/[#*`_~]/g, '') : ''
    const date = issue?.createdAt

    return new ImageResponse(
      <OgCard
        title={title}
        excerpt={excerpt}
        tags={['newsletter', 'dispatch']}
        date={date}
        authorName="George Ongoro"
        badgeText="NEWSLETTER"
      />,
      {
        ...size,
        fonts,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      <OgCard title="Newsletter Dispatch" tags={['newsletter']} badgeText="NEWSLETTER" />,
      {
        ...size,
        fonts,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  }
}
