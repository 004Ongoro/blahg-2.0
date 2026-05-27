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
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/series"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={14} /> Back to collections
          </Link>
        </div>

        {/* Series Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-foreground">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded">Collection</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                {decodedName}
              </h1>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {posts.length} Sequential Records
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="space-y-12">
          <PostList posts={posts} />
        </section>

        {/* Bottom Metadata */}
        <div className="mt-32 pt-8 border-t border-foreground/5 opacity-40">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest">End of Series: {decodedName}</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 w-4 bg-foreground/20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
