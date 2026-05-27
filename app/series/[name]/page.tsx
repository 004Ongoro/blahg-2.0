import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostList } from '@/components/PostList'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { notFound } from 'next/navigation'
import { Layers, ChevronLeft, Info, Terminal, Activity } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  try {
    await dbConnect()
    const series = await Post.distinct('series', { published: true, series: { $ne: null } })
    return series.map((name: string) => ({
      name: encodeURIComponent(name),
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

interface Props {
  params: Promise<{ name: string }>
}

async function getSeriesPosts(seriesName: string) {
  try {
    await dbConnect()
    const posts = await Post.find({ 
      series: seriesName, 
      published: true 
    }).sort({ seriesOrder: 1, createdAt: 1 }).lean()
    
    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching series posts:', error)
    return []
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const posts = await getSeriesPosts(decodedName)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col font-mono bg-background">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/series"
            className="group inline-flex items-center gap-2 px-4 py-2 brutal-border bg-card font-black uppercase text-xs hover:bg-accent transition-all"
          >
            <ChevronLeft size={16} /> Back to Series
          </Link>
        </div>

        {/* Series Header */}
        <header className="mb-20">
          <div className="inline-block bg-accent text-accent-foreground px-3 py-1 text-[10px] font-black uppercase mb-6 tracking-widest brutal-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Series Archive
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
              {decodedName}
            </h1>
            <div className="bg-foreground text-background px-4 py-2 brutal-border font-black uppercase text-sm">
              {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="relative">
          <div className="absolute -left-8 top-0 bottom-0 w-1 bg-foreground hidden md:block" />
          <div className="space-y-12">
            <PostList posts={posts} />
          </div>
        </section>

        {/* Bottom Metadata */}
        <div className="mt-32 pt-12 border-t-4 border-foreground flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest">Collection ID</span>
            <span className="text-sm font-bold">{decodedName.toUpperCase().replace(/\s+/g, '_')}</span>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-2 w-10 bg-foreground brutal-border" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
