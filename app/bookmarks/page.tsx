import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BookmarksView } from '@/components/BookmarksView'
import dbConnect from '@/lib/mongodb'
import Bookmark from '@/models/Bookmark'

import { Metadata } from 'next'
import { getBaseUrl } from '@/lib/utils'

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: 'Curated Developer Bookmarks',
  description: 'A curated collection of developer tools, NPM libraries, design resources, and useful technical references.',
  alternates: {
    canonical: `${baseUrl}/bookmarks`,
  },
  openGraph: {
    title: 'Curated Developer Bookmarks',
    description: 'A curated collection of developer tools, NPM libraries, design resources, and useful technical references.',
    url: `${baseUrl}/bookmarks`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Developer Bookmarks',
    description: 'A curated collection of developer tools, NPM libraries, design resources, and useful technical references.',
  },
}

export const revalidate = 60 // Revalidate page cache every 60 seconds

export default async function BookmarksPage() {
  let plainBookmarks: any[] = []

  try {
    await dbConnect()
    const bookmarks = await Bookmark.find({
      isDraft: { $ne: true },
      url: { $not: /draft\.local/i },
    })
      .sort({ createdAt: -1 })
      .lean()

    plainBookmarks = bookmarks
      .filter((doc: any) => !doc.isDraft && !doc.url?.toLowerCase().includes('draft.local'))
      .map((doc: any) => ({
        _id: doc._id.toString(),
        title: doc.title,
        url: doc.url,
        description: doc.description,
        category: doc.category,
        tags: doc.tags || [],
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date().toISOString(),
      }))
  } catch (error) {
    console.error('Failed to load bookmarks on server:', error)
  }

  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header section */}
        <header className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase">
            Curated <span className="text-accent italic">Bookmarks</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
            A growing library of tools, websites, utilities, and references I find useful in my daily development workflow.
          </p>
        </header>

        {/* Dynamic client-side list view */}
        <BookmarksView initialBookmarks={plainBookmarks} />
      </main>
      
      <Footer />
    </div>
  )
}
