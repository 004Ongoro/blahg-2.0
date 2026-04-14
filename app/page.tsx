import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostCard } from '@/components/PostCard'
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

          {posts.length === 0 ? (
            <div className="brutal-border brutal-shadow bg-card p-8 text-center">
              <p className="text-muted-foreground text-lg mb-2">
                no posts yet.
              </p>
              <p className="text-sm text-muted-foreground">
                check back later or head to{' '}
                <a href="/admin" className="text-accent hover:underline">
                  /admin
                </a>{' '}
                to create your first post.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post: {
                _id: string
                title: string
                slug: string
                excerpt: string
                createdAt: string
                readTime: number
                tags: string[]
              }) => (
                <PostCard
                  key={post._id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  createdAt={new Date(post.createdAt)}
                  readTime={post.readTime}
                  tags={post.tags}
                />
              ))}
            </div>
          )}
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
