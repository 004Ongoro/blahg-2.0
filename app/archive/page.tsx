import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArchiveCalendar } from '@/components/ArchiveCalendar'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import NewsletterIssue from '@/models/NewsletterIssue'

export const dynamic = 'force-static'
export const revalidate = 3600

// Fetch archive data
async function getArchiveData() {
  try {
    await dbConnect()
    
    const [posts, issues] = await Promise.all([
      Post.find({ published: true }).select('title slug createdAt').lean(),
      NewsletterIssue.find({ published: true }).select('subject slug createdAt').lean()
    ])

    const formattedPosts = (posts as any[]).map(p => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      date: p.createdAt,
      type: 'post' as const
    }))

    const formattedIssues = (issues as any[]).map(i => ({
      id: i._id.toString(),
      title: i.subject,
      slug: i.slug,
      date: i.createdAt,
      type: 'newsletter' as const
    }))

    return [...formattedPosts, ...formattedIssues]
  } catch (error) {
    console.error('Error fetching archive:', error)
    return []
  }
}

// Full-width calendar archive page
export default async function ArchivePage() {
  const items = await getArchiveData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 py-8 sm:py-12">
        <header className="mb-12 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
            Content <span className="text-accent italic">Archive</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg font-bold uppercase leading-tight">
            Historical roadmap of all published thoughts and newsletter dispatches.
          </p>
        </header>

        <div className="max-w-[1600px] mx-auto">
          <ArchiveCalendar items={JSON.parse(JSON.stringify(items))} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
