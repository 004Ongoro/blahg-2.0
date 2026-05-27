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
    <div className="min-h-screen flex flex-col font-mono">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 md:py-32 w-full">
        {/* Navigation HUD */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/series"
            className="group flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-md border border-foreground/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back_to_Modules
          </Link>
          
          <div className="hidden md:flex items-center gap-3 opacity-30">
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Status: Sequential_Read_Mode</span>
            <div className="h-1 w-1 rounded-full bg-accent animate-pulse" />
          </div>
        </div>

        {/* Series Identity Header */}
        <header className="mb-20">
          <div className="flex items-start gap-6 mb-8">
            <div className="h-20 w-20 bg-accent text-accent-foreground rounded-[2rem] flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
              <Layers size={40} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Collection_Manifest</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                {decodedName}
              </h1>
            </div>
          </div>

          {/* Series Meta HUD Bar */}
          <div className="flex flex-wrap items-center gap-3 p-2 bg-foreground/5 rounded-[2rem] border border-foreground/5">
            <div className="px-6 py-3 bg-background rounded-full border border-foreground/5 flex items-center gap-3 shadow-sm">
              <Activity size={14} className="text-accent" />
              <span className="text-xs font-black uppercase tracking-widest">
                {posts.length} Sequential_Steps
              </span>
            </div>
            
            <div className="px-6 py-3 flex items-center gap-3">
              <Info size={14} className="text-muted-foreground/40" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-none pt-1">
                Ordered by series hierarchy
              </p>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-foreground/5 to-transparent hidden md:block" />
          
          <div className="space-y-12">
            <PostList posts={posts} />
          </div>
        </section>

        {/* Bottom HUD Metadata */}
        <div className="mt-32 pt-12 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Collection_ID</span>
              <span className="text-[10px] font-bold">{decodedName.toUpperCase().replace(/\s+/g, '_')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-1 w-8 bg-foreground/10 rounded-full" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
