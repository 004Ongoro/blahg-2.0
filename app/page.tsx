import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostList } from '@/components/PostList'
import { Newsletter } from '@/components/Newsletter'
import { AboutSection } from '@/components/AboutSection'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const revalidate = 3600 // Revalidate every hour

async function getPosts() {
  try {
    await dbConnect()
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .select('-content')
      .lean()
    
    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <AboutSection />

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-accent">{'>'}</span> latest posts
            <span className="text-muted-foreground text-sm font-normal ml-2">
              ({posts.length})
            </span>
          </h2>

          <PostList posts={posts} />
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
