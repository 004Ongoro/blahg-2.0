import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import NewsletterIssue from '@/models/NewsletterIssue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { format } from 'date-fns'

export const dynamic = 'force-static'
export const revalidate = false

interface ArchiveItem {
  id: string
  title: string
  slug: string
  date: Date
  type: 'post' | 'newsletter'
}

async function getArchiveData() {
  try {
    await dbConnect()
    
    const [posts, issues] = await Promise.all([
      Post.find({ published: true }).sort({ createdAt: -1 }).select('title slug createdAt').lean(),
      NewsletterIssue.find({ published: true }).sort({ createdAt: -1 }).select('subject slug createdAt').lean()
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

    const allItems = [...formattedPosts, ...formattedIssues].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Group by year
    const grouped: Record<string, ArchiveItem[]> = {}
    allItems.forEach(item => {
      const year = format(new Date(item.date), 'yyyy')
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(item)
    })

    return grouped
  } catch (error) {
    console.error('Error fetching archive:', error)
    return {}
  }
}

export default async function ArchivePage() {
  const groupedItems = await getArchiveData()
  const years = Object.keys(groupedItems).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">
            Archive
          </h1>
          <p className="text-muted-foreground font-medium">
            A chronological list of everything I've published.
          </p>
        </header>

        <Accordion type="multiple" defaultValue={[years[0]]} className="w-full">
          {years.map((year) => (
            <AccordionItem key={year} value={year} className="border-foreground/10">
              <AccordionTrigger className="text-2xl font-black uppercase tracking-tighter hover:no-underline hover:text-accent">
                {year}
                <span className="ml-2 text-xs text-muted-foreground font-bold">
                  ({groupedItems[year].length} items)
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 py-4">
                  {groupedItems[year].map((item) => (
                    <div key={item.id} className="group flex items-baseline gap-4">
                      <time className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-20 shrink-0">
                        {format(new Date(item.date), 'MMM dd')}
                      </time>
                      <Link 
                        href={item.type === 'post' ? `/post/${item.slug}` : `/newsletter/archive/${item.slug}`}
                        className="text-sm font-bold hover:text-accent transition-colors flex-1"
                      >
                        {item.title}
                        {item.type === 'newsletter' && (
                          <span className="ml-2 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded uppercase font-black">
                            Issue
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  )
}
