import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import Link from 'next/link'
import { Layers } from 'lucide-react'

export const revalidate = 3600

async function getSeries() {
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
}

export default async function SeriesPage() {
  const series = await getSeries()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-black uppercase mb-8 flex items-center gap-3">
          <Layers className="w-10 h-10 text-accent" />
          Series
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {series.map((s) => (
            <Link 
              key={s.name} 
              href={`/series/${encodeURIComponent(s.name)}`}
              className="brutal-border brutal-shadow bg-card p-6 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_var(--foreground)] transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">{s.name}</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-accent">{s.postCount} {s.postCount === 1 ? 'post' : 'posts'}</span>
                <span className="text-muted-foreground italic">
                  Last updated {new Date(s.latestPost).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {series.length === 0 && (
          <div className="brutal-border brutal-shadow bg-card p-12 text-center">
            <p className="text-muted-foreground text-lg italic">No series found yet. Check back later!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
