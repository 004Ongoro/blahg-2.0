import type { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ScrollProgress } from '@/components/ScrollProgress'
import { ContactDialog } from '@/components/ContactDialog'
import { MessageSquare } from 'lucide-react'
import { getBaseUrl } from '@/lib/utils'
import { CookieBanner } from '@/components/CookieBanner'
import './globals.css'

const jetbrainsMono = {
  variable: '--font-mono',
}

const baseUrl = getBaseUrl()
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

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
        url: `${baseUrl}/api/og?title=${encodeURIComponent('George Ongoro Blog')}`,
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
  alternates: {
    types: {
      'application/rss+xml': `${baseUrl}/rss.xml`,
    },
  },
  other: {
    'opensearch-description': `${baseUrl}/opensearch.xml`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="George Ongoro Blog" href="/opensearch.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${baseUrl}/#website`,
                  url: baseUrl,
                  name: 'George Ongoro Blog',
                  description: 'Technical insights on web development, clean architecture, and modern coding practices.',
                  publisher: {
                    '@id': `${baseUrl}/#organization`,
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `https://www.google.com/search?q=site%3Acode.geohack.top+{search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'NewsMediaOrganization',
                  '@id': `${baseUrl}/#organization`,
                  name: 'George Ongoro Blog',
                  url: baseUrl,
                  logo: `${baseUrl}/api/og?title=George+Ongoro`,
                  sameAs: [
                    'https://x.com/ongorogeorg_e',
                    'https://github.com/004Ongoro',
                    'https://news.google.com/search?q=site%3Acode.geohack.top',
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ScrollProgress />
          <CookieBanner />
          <ContactDialog trigger={
            <button
              className="fixed bottom-24 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/5 bg-background/70 backdrop-blur-md shadow-sm text-foreground hover:bg-foreground/5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Contact"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          } />
        </ThemeProvider>
      </body>
    </html>
  )
}
