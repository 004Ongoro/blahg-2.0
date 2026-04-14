import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import { GiscusComments } from '@/components/GiscusComments'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    await dbConnect()
    const post = await Post.findOne({ slug, published: true }).lean()
    return post ? JSON.parse(JSON.stringify(post)) : null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return { title: 'Post Not Found' }
  }
  
  return {
    title: `${post.title} | dev.blog`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <article>
          <header className="mb-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-accent text-sm mb-4 inline-block"
            >
              &larr; back to posts
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span>{formatDate(post.createdAt)}</span>
              <span className="text-accent">|</span>
              <span>{post.readTime} min read</span>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="bg-secondary text-secondary-foreground px-3 py-1 text-sm brutal-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="brutal-border brutal-shadow bg-card p-6 md:p-8 mb-8">
            <MarkdownContent content={post.content} />
          </div>

          <section className="brutal-border brutal-shadow bg-card p-6">
            <h3 className="text-xl font-bold mb-4">
              <span className="text-accent">{'>'}</span> comments
            </h3>
            <GiscusComments />
          </section>
        </article>
      </main>
      <Footer />
    </div>
  )
}
