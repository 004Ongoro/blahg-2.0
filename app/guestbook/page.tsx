import { Metadata } from 'next'
import { GuestbookView } from '@/components/GuestbookView'
import { getBaseUrl } from '@/lib/utils'

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: 'Developer Guestbook',
  description: 'Leave a note, share feedback, or say hi on George Ongoro\'s developer guestbook and transmission log.',
  alternates: {
    canonical: `${baseUrl}/guestbook`,
  },
  openGraph: {
    title: 'Developer Guestbook',
    description: 'Leave a note, share feedback, or say hi on George Ongoro\'s developer guestbook and transmission log.',
    url: `${baseUrl}/guestbook`,
    type: 'website',
  },
}

export default function GuestbookPage() {
  return <GuestbookView />
}
