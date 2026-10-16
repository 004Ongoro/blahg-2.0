import { Metadata } from 'next'
import { NewsletterView } from '@/components/NewsletterView'
import { getBaseUrl } from '@/lib/utils'

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: 'Developer Newsletter & Dispatches',
  description: 'Subscribe to George Ongoro\'s newsletter for practical insights on full-stack development, side projects, and hands-on programming.',
  alternates: {
    canonical: `${baseUrl}/newsletter`,
  },
  openGraph: {
    title: 'Developer Newsletter & Dispatches',
    description: 'Subscribe to George Ongoro\'s newsletter for practical insights on full-stack development, side projects, and hands-on programming.',
    url: `${baseUrl}/newsletter`,
    type: 'website',
  },
}

export default function NewsletterPage() {
  return <NewsletterView />
}
