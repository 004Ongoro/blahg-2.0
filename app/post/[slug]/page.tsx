import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import { TableOfContents } from '@/components/TableOfContents'
import GiscusComments from '@/components/GiscusComments'
import { Newsletter } from '@/components/Newsletter'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getBaseUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PostReactions } from '@/components/PostReactions'
import { MoreLikeThis } from '@/components/MoreLikeThis'
import { SocialShare } from '@/components/SocialShare'
import { FormattedDate } from '@/components/FormattedDate'

export const dynamic = 'force-static'
export const revalidate = false

// Static generation
export async function generateStaticParams() {
  try {
    await dbConnect()
    const posts = await Post.find({ published: true }).select('slug').lean()
    return posts.map((post: any) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

// Data fetching
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

// Navigation data fetching
async function getNavigation(currentCreatedAt: Date) {
  try {
    await dbConnect()
    
    const prevPost = await Post.findOne({ 
      published: true, 
      createdAt: { $lt: currentCreatedAt } 
    }).sort({ createdAt: -1 }).select('slug').lean()

    const nextPost = await Post.findOne({ 
      published: true, 
      createdAt: { $gt: currentCreatedAt } 
    }).sort({ createdAt: 1 }).select('slug').lean()

    return {
      prev: prevPost ? String(prevPost.slug) : null,
      next: nextPost ? String(nextPost.slug) : null,
    }
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return { prev: null, next: null }
  }
}

async function getRelatedPosts(tags: string[], currentSlug: string) {
  try {
    await dbConnect()
    const posts = await Post.find({
      slug: { $ne: currentSlug },
      published: true,
      tags: { $in: tags }
    })
    .select('title slug')
    .limit(5)
    .lean()
    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Metadata generation
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  const baseUrl = getBaseUrl()
  
  if (!post) return { title: 'Post Not Found' }
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${baseUrl}/post/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${baseUrl}/post/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

// Main component
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post.tags || [], slug)
  const nav = await getNavigation(new Date(post.createdAt))

  const baseUrl = getBaseUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: 'George Ongoro',
      url: baseUrl,
    },
  }

  const isUpdated = post.updatedAt && 
    new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 1000 * 60 * 5

  return (
    <div className="min-h-screen flex flex-col relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 md:py-24 w-full">
        <article>
          <TableOfContents content={post.content} />
          <header className="mb-16">
            <div className="flex justify-between items-center mb-12">
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> posts
              </Link>
              <SocialShare title={post.title} slug={slug} />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1] text-balance">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground/60">
              <FormattedDate date={post.createdAt} />
              <span className="h-1 w-1 rounded-full bg-foreground/10" />
              <span>{post.readTime} min read</span>
              {isUpdated && (
                <>
                  <span className="h-1 w-1 rounded-full bg-foreground/10" />
                  <span className="italic text-muted-foreground/40">Updated <FormattedDate date={post.updatedAt} /></span>
                </>
              )}
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-16">
            <MarkdownContent content={post.content} />
          </div>

          <div className="mb-16">
            <Newsletter />
          </div>

          <div className="flex flex-col gap-8 py-12 border-y border-foreground/5 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {nav.prev ? (
                <Link href={`/post/${nav.prev}`} className="group space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Previous</span>
                  <p className="font-bold group-hover:text-accent transition-colors flex items-center gap-2 leading-tight">
                    <ChevronLeft className="h-4 w-4 shrink-0" /> {nav.prev.replace(/-/g, ' ')}
                  </p>
                </Link>
              ) : <div />}

              {nav.next ? (
                <Link href={`/post/${nav.next}`} className="group space-y-2 md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Next</span>
                  <p className="font-bold group-hover:text-accent transition-colors flex items-center gap-2 md:justify-end leading-tight">
                    {nav.next.replace(/-/g, ' ')} <ChevronRight className="h-4 w-4 shrink-0" />
                  </p>
                </Link>
              ) : <div />}
            </div>
          </div>

          <PostReactions 
            slug={slug} 
            initialReactions={post.reactions ? JSON.parse(JSON.stringify(post.reactions)) : {}} 
          />

          <MoreLikeThis posts={relatedPosts} />

          <GiscusComments />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-20 pt-12 border-t border-foreground/5">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/tags?tag=${encodeURIComponent(tag)}`}
                    className="text-xs font-bold text-muted-foreground hover:text-accent transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
