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
      <TableOfContents content={post.content} />

      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        <article>
          <header className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent text-sm font-bold uppercase tracking-widest"
              >
                &larr; back to posts
              </Link>
              <SocialShare title={post.title} slug={slug} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 tracking-tighter leading-none text-balance">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <FormattedDate date={post.createdAt} />
              {isUpdated && (
                <>
                  <span className="h-1 w-1 rounded-full bg-accent/30" />
                  <span className="italic">Edited <FormattedDate date={post.updatedAt} /></span>
                </>
              )}
              <span className="h-1 w-1 rounded-full bg-accent/30" />
              <span>{post.readTime} mins read</span>
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-16">
            <MarkdownContent content={post.content} />
          </div>

          <div className="mb-16">
            <Newsletter />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-16">
            {nav.prev ? (
              <Button asChild variant="outline" className="h-16 font-black uppercase tracking-tighter border-2">
                <Link href={`/post/${nav.prev}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Link>
              </Button>
            ) : <div />}

            {nav.next ? (
              <Button asChild variant="outline" className="h-16 font-black uppercase tracking-tighter border-2">
                <Link href={`/post/${nav.next}`}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : <div />}
          </div>

          <PostReactions 
            slug={slug} 
            initialReactions={post.reactions ? JSON.parse(JSON.stringify(post.reactions)) : {}} 
          />

          <MoreLikeThis posts={relatedPosts} />

          <GiscusComments />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-12 border-t border-foreground/5">
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-muted-foreground">
                Related Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-3 py-1.5 bg-foreground/5 text-foreground hover:bg-accent hover:text-accent-foreground text-[10px] font-black uppercase tracking-wider transition-colors"
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
