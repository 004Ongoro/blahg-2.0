import { Metadata } from 'next'
import { NewsletterView } from '@/components/NewsletterView'
import { getBaseUrl } from '@/lib/utils'

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: 'Engineering Newsletter & Dispatches',
  description: 'Subscribe to George Ongoro\'s newsletter for weekly insights on software engineering, performance, distributed systems, and modern architecture.',
  alternates: {
    canonical: `${baseUrl}/newsletter`,
  },
  openGraph: {
    title: 'Engineering Newsletter & Dispatches',
    description: 'Subscribe to George Ongoro\'s newsletter for weekly insights on software engineering, performance, distributed systems, and modern architecture.',
    url: `${baseUrl}/newsletter`,
    type: 'website',
  },
}

export default function NewsletterPage() {
  return <NewsletterView />
}
