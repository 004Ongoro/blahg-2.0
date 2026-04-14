import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostCard } from '@/components/PostCard'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const revalidate = 3600

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
    title: `#${decodedTag} | dev.blog`,
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
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="mb-8">
          <Link
            href="/tags"
            className="text-muted-foreground hover:text-accent text-sm mb-4 inline-block"
          >
            &larr; all tags
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="text-accent">{'>'}</span> #{decodedTag}
            <span className="text-muted-foreground text-lg font-normal ml-3">
              ({posts.length} {posts.length === 1 ? 'post' : 'posts'})
            </span>
          </h1>
        </div>

        {posts.length === 0 ? (
          <div className="brutal-border brutal-shadow bg-card p-8 text-center">
            <p className="text-muted-foreground">
              no posts with this tag yet.
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
      </main>
      <Footer />
    </div>
  )
}
