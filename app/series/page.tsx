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
    <div className="min-h-screen flex flex-col font-mono">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Curated <span className="text-accent italic">Series</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Deep dives into specific technical domains, organized for sequential learning.
          </p>
        </header>

        <div className="space-y-12">
          {series.map((s) => (
            <Link 
              key={s.name} 
              href={`/series/${encodeURIComponent(s.name)}`}
              className="group block py-8 border-t border-foreground/5 transition-all hover:bg-foreground/[0.01]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded">Module</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.postCount} {s.postCount === 1 ? 'Article' : 'Articles'}</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-none">
                    {s.name}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <Clock size={12} />
                    <span>Last Updated: {new Date(s.latestPost).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                  View_Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {series.length === 0 && (
          <div className="py-20 text-center opacity-40">
            <p className="text-sm font-black uppercase tracking-widest">No series found</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
