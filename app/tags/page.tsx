import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const revalidate = 3600

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
  title: 'Tags | dev.blog',
  description: 'Browse posts by topic',
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">
          <span className="text-accent">{'>'}</span> all tags
        </h1>

        {tags.length === 0 ? (
          <div className="brutal-border brutal-shadow bg-card p-8 text-center">
            <p className="text-muted-foreground">no tags yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              tags will appear here once you create posts with tags.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="brutal-border brutal-shadow bg-card px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <span className="text-lg font-bold">#{tag.name}</span>
                <span className="ml-2 text-muted-foreground group-hover:text-accent-foreground">
                  ({tag.count})
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
