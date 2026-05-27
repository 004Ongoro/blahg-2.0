import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import Link from 'next/link'
import { Layers, ChevronRight, Activity, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = false

async function getSeries() {
  try {
    await dbConnect()
    const result = await Post.aggregate([
      { $match: { published: true, series: { $ne: null, $exists: true } } },
      {
        $group: {
          _id: '$series',
          postCount: { $sum: 1 },
          latestPost: { $max: '$createdAt' }
        }
      },
      { $sort: { latestPost: -1 } }
    ])
    return result.map(r => ({
      name: r._id,
      postCount: r.postCount,
      latestPost: r.latestPost
    }))
  } catch (error) {
    console.error('Error fetching series:', error)
    return []
  }
}

export default async function SeriesPage() {
  const series = await getSeries()

  return (
    <div className="min-h-screen flex flex-col font-mono bg-background">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-16">
          <div className="inline-block bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase mb-6 tracking-widest">
            Archive Collections
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.8]">
            Curated <span className="text-accent italic">Series</span>
          </h1>
          <p className="text-xl font-bold max-w-2xl leading-tight">
            Deep dives into specific technical domains, organized for sequential learning.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {series.map((s) => (
            <Link 
              key={s.name} 
              href={`/series/${encodeURIComponent(s.name)}`}
              className="group brutal-border brutal-shadow bg-card p-10 flex flex-col justify-between transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Collection Module</span>
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 leading-[0.9] group-hover:text-accent transition-colors">
                  {s.name}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
                    <Activity size={14} className="text-accent" />
                    <span>{s.postCount} {s.postCount === 1 ? 'Article' : 'Articles'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
                    <Clock size={14} />
                    <span>Updated: {new Date(s.latestPost).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t-2 border-foreground/10 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest bg-foreground text-background px-3 py-1">View Index</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {series.length === 0 && (
          <div className="py-24 brutal-border border-dashed bg-muted/30 text-center opacity-60">
            <Layers size={48} className="mx-auto mb-4" />
            <p className="text-xl font-black uppercase tracking-widest">No collections found</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
