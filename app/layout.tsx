// app/layout.tsx
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.ongoro.top'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Blog by George Ongoro - Tech and Coding',
    template: '%s | George Ongoro',
  },
  description: 'Technical insights on web development, clean architecture, and modern coding practices.',
  keywords: ['George Ongoro', 'developer', 'blog', 'programming', 'Next.js', 'MongoDB', 'TypeScript'],
  authors: [{ name: 'George Ongoro' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'George Ongoro Blog',
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('George Ongoro Blog')}`,
        width: 1200,
        height: 630,
        alt: 'George Ongoro Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@004Ongoro',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N9W5NHT9N3"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-N9W5NHT9N3');
        </script>
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}