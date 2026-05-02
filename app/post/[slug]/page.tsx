import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import { TableOfContents } from '@/components/TableOfContents'
import GiscusComments from '@/components/GiscusComments'
import { Newsletter } from '@/components/Newsletter'
import { LuckyButton } from '@/components/LuckyButton'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { formatDate } from '@/lib/utils'
import PostAnimations from '@/components/PostAnimations'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

async function getNavigation(currentCreatedAt: Date) {
  try {
    await dbConnect()
    
    // Fetch Previous and Next based on creation date
    const prevPost = await Post.findOne({ 
      published: true, 
      createdAt: { $lt: currentCreatedAt } 
    }).sort({ createdAt: -1 }).select('slug').lean()

    const nextPost = await Post.findOne({ 
      published: true, 
      createdAt: { $gt: currentCreatedAt } 
    }).sort({ createdAt: 1 }).select('slug').lean()

    // Fetch all slugs for the "I'm Feeling Lucky" logic (client-side randomness)
    const allPosts = await Post.find({ published: true }).select('slug').lean()
    const allSlugs = allPosts.map(p => p.slug)

    return {
      prev: prevPost?.slug || null,
      next: nextPost?.slug || null,
      allSlugs
    }
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return { prev: null, next: null, allSlugs: [] }
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.ongoro.top'
  
  if (!post) return { title: 'Post Not Found' }
  
  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}`
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${baseUrl}/post/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${baseUrl}/post/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const nav = await getNavigation(new Date(post.createdAt))

  const isUpdated = post.updatedAt && 
    new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 1000 * 60 * 5 // More than 5 minutes difference

  return (
    <div className="min-h-screen flex flex-col relative">
      <PostAnimations />
      <TableOfContents content={post.content} />

      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <article>
          <header className="mb-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-accent text-sm mb-4 inline-block font-bold"
            >
              &larr; back to posts
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span>{formatDate(post.createdAt)}</span>
              {isUpdated && (
                <>
                  <span className="text-accent">•</span>
                  <span className="italic font-medium">Last edited {formatDate(post.updatedAt)}</span>
                </>
              )}
              <span className="text-accent">|</span>
              <span>{post.readTime} mins read</span>
            </div>
          </header>

          <div className="brutal-border brutal-shadow bg-card p-6 md:p-8 mb-8">
            <MarkdownContent content={post.content} />
          </div>

          {/* Inline Newsletter Signup */}
          <div className="mb-12">
            <Newsletter />
          </div>

          {/* Navigation Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="w-full">
              {nav.prev ? (
                <Link href={`/post/${nav.prev}`} passHref>
                  <Button variant="outline" className="w-full brutal-border brutal-shadow hover:bg-accent hover:text-white font-bold h-12">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                </Link>
              ) : null}
            </div>

            <LuckyButton allSlugs={nav.allSlugs} currentSlug={slug} />

            <div className="w-full">
              {nav.next ? (
                <Link href={`/post/${nav.next}`} passHref>
                  <Button variant="outline" className="w-full brutal-border brutal-shadow hover:bg-accent hover:text-white font-bold h-12">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>

          <GiscusComments />
        </article>
      </main>

      <Footer />
    </div>
  )
}
