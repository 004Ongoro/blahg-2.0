import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostCard } from '@/components/PostCard'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  try {
    await dbConnect()
    const posts = await Post.find({ published: true }).select('tags').lean()
    const tags = new Set<string>()
    posts.forEach((post: any) => {
      post.tags?.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags).map((tag) => ({
      tag: encodeURIComponent(tag),
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

interface Props {
  params: Promise<{ tag: string }>
}

async function getPostsByTag(tag: string) {
  try {
    await dbConnect()
    const posts = await Post.find({ 
      published: true, 
      tags: decodeURIComponent(tag) 
    })
      .sort({ createdAt: -1 })
      .select('-content')
      .lean()

    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  return {
    title: `#${decodedTag} | George Ongoro`,
    description: `Posts tagged with ${decodedTag}`,
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = await getPostsByTag(tag)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 md:py-24 w-full">
        <header className="mb-16">
          <Link
            href="/tags"
            className="text-muted-foreground hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" /> all tags
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">
            #{decodedTag}
            <span className="text-muted-foreground/30 text-xl font-bold ml-4 tabular-nums">
              {posts.length}
            </span>
          </h1>
        </header>

        {posts.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 p-12 text-center rounded-lg">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">no posts with this tag yet.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {posts.map((post: any) => (
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
      </main>
      <Footer />
    </div>
  )
}
