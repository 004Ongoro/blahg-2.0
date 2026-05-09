import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArchiveCalendar } from '@/components/ArchiveCalendar'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import NewsletterIssue from '@/models/NewsletterIssue'

export const dynamic = 'force-static'
export const revalidate = 3600

// Fetch all archive data
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
    console.error('Error fetching archive data:', error)
    return []
  }
}

// Archive page
export default async function ArchivePage() {
  const items = await getArchiveData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <header className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Content <span className="text-accent italic">Archive</span>
            </h1>
            <Link 
              href="/newsletter/archive" 
              className="brutal-border px-4 py-2 bg-accent text-accent-foreground font-black uppercase text-xs hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_var(--foreground)] transition-all"
            >
              List View
            </Link>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-bold uppercase">
            Browse through every blog post and newsletter issue published since the beginning.
          </p>
        </header>

        <ArchiveCalendar items={JSON.parse(JSON.stringify(items))} />
      </main>
      <Footer />
    </div>
  )
}
