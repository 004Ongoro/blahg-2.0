import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TagLibrary } from '@/components/TagLibrary'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const dynamic = 'force-static'
export const revalidate = false

async function getAllPosts() {
  try {
    await dbConnect()
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug excerpt createdAt readTime tags')
      .lean()

    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching posts for tag library:', error)
    return []
  }
}

export const metadata = {
  title: 'Library | George Ongoro',
  description: 'A categorized index of all posts and topics.',
}

export default async function TagsPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-32 w-full">
        <header className="mb-24 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Tag <span className="text-accent italic">Library</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-md">
            A high-density index of every topic, thought, and technical deep-dive.
          </p>
        </header>

        <TagLibrary posts={posts} />
      </main>
      <Footer />
    </div>
  )
}
