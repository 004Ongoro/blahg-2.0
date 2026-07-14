import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ScrollProgress } from '@/components/ScrollProgress'
import { ContactDialog } from '@/components/ContactDialog'
import { MessageSquare } from 'lucide-react'
import { getBaseUrl } from '@/lib/utils'
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        {/* Google Analytics - Moved outside ThemeProvider to prevent hydration script tag issues */}
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
          defaultTheme="light"
          enableSystem={false}
          enableColorScheme={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ScrollProgress />
          <ContactDialog trigger={
            <button
              className="fixed bottom-24 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/5 bg-background/70 backdrop-blur-md shadow-sm text-foreground hover:bg-foreground/5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Contact"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          } />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
