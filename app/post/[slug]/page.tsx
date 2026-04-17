import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import GiscusComments from '@/components/GiscusComments'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = false

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.ongoro.top'
  
  if (!post) {
    return { title: 'Post Not Found' }
  }
  
  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}`
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${baseUrl}/post/${slug}`, // Canonical link for SEO
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${baseUrl}/post/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
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
        <article itemScope itemType="https://schema.org/BlogPosting">
          <header className="mb-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-accent text-sm mb-4 inline-block"
            >
              &larr; back to posts
            </Link>
            <h1 itemProp="headline" className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <time itemProp="datePublished" dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
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

          <div className="brutal-border brutal-shadow bg-card p-6 md:p-8 mb-8" itemProp="articleBody">
            <MarkdownContent content={post.content} />
          </div>

          <GiscusComments />
        </article>
      </main>
      <Footer />
    </div>
  )
}