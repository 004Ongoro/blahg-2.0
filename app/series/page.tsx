import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import Link from 'next/link'
import { Layers, ChevronRight, Activity, Clock } from 'lucide-react'
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
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 md:py-32 w-full">
        {/* Header HUD */}
        <header className="mb-20 relative">
          <div className="absolute -top-10 left-0 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Archive_Collections</span>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="h-16 w-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent">
              <Layers size={32} />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Curated <span className="text-accent italic">Series</span>
              </h1>
              <p className="text-muted-foreground font-medium mt-2">
                Deep dives into specific technical domains.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {series.map((s) => (
            <Link 
              key={s.name} 
              href={`/series/${encodeURIComponent(s.name)}`}
              className="group relative bg-background/40 backdrop-blur-md border border-foreground/10 rounded-[2rem] p-8 hover:border-accent/40 transition-all duration-300 overflow-hidden"
            >
              {/* Card HUD Elements */}
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="text-accent h-6 w-6 transform -rotate-45 group-hover:rotate-0 transition-transform" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-6 bg-accent/30 rounded-full" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Collection_Module</span>
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight mb-8 group-hover:text-accent transition-colors">
                  {s.name}
                </h2>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <Activity size={12} className="text-accent" />
                    <span>{s.postCount} {s.postCount === 1 ? 'article' : 'articles'} mapped</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <Clock size={12} />
                    <span>Last Update: {new Date(s.latestPost).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-foreground/5 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-full">Explore_Data</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-1 w-1 rounded-full bg-accent/20" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Background Accent */}
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
            </Link>
          ))}
        </div>

        {series.length === 0 && (
          <div className="py-32 bg-foreground/5 rounded-[3rem] border border-dashed border-foreground/10 text-center">
            <div className="max-w-xs mx-auto space-y-4 opacity-40">
              <Layers size={48} className="mx-auto" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">No collections found</p>
              <p className="text-[10px] font-medium leading-relaxed">
                The series archive is currently empty. Check back after the next deployment.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
