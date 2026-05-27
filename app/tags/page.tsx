import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const dynamic = 'force-static'
export const revalidate = false

async function getTags() {
  try {
    await dbConnect()
    const tags = await Post.aggregate([
      { $match: { published: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    return tags.map((tag) => ({
      name: tag._id,
      count: tag.count,
    }))
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export const metadata = {
  title: 'Tags | George Ongoro',
  description: 'Browse posts by topic',
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 md:py-24 w-full">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">
            Tags
          </h1>
          <p className="text-muted-foreground font-medium">
            Browse content by topic.
          </p>
        </header>

        {tags.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 p-12 text-center rounded-lg">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">no tags yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-8 gap-y-6">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="group flex items-baseline gap-2"
              >
                <span className="text-xl font-bold group-hover:text-accent transition-colors">#{tag.name}</span>
                <span className="text-xs font-bold text-muted-foreground/30 group-hover:text-accent/50 transition-colors tabular-nums">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
