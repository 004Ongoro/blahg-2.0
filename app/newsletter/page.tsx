import { Metadata } from 'next'
import { NewsletterView } from '@/components/NewsletterView'
import { getBaseUrl } from '@/lib/utils'

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: 'Your Next Coding Idea Starts Here | George Ongoro',
  description: 'Your next coding idea starts here. From hands-on tutorials to open-source discoveries and side-project deep dives, get fresh ideas to learn, build, and experiment with.',
  alternates: {
    canonical: `${baseUrl}/newsletter`,
  },
  openGraph: {
    title: 'Your Next Coding Idea Starts Here | George Ongoro',
    description: 'From hands-on tutorials to open-source discoveries and side-project deep dives, get fresh ideas to learn, build, and experiment with.',
    url: `${baseUrl}/newsletter`,
    type: 'website',
  },
}

export default function NewsletterPage() {
  return <NewsletterView />
}
