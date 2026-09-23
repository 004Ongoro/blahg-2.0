import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { OgCard } from '@/components/OgCard'

export const runtime = 'nodejs'

export const alt = 'Newsletter Issue'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await dbConnect()
    const issue = await NewsletterIssue.findOne({ slug, published: true }).select('subject').lean()

    const title = issue?.subject || 'Newsletter Dispatch'

    return new ImageResponse(
      <OgCard title={title} tags={['newsletter', 'dispatch']} authorName="George Ongoro" />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      <OgCard title="Newsletter Dispatch" tags={['newsletter']} />,
      {
        ...size,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  }
}
