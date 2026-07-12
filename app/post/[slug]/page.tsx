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
import { getBaseUrl } from '@/lib/utils'
import PostAnimations from '@/components/PostAnimations'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ViewCounter } from '@/components/ViewCounter'
import { SeriesCard } from '@/components/SeriesCard'
import { PostReactions } from '@/components/PostReactions'
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

// Series data fetching
async function getSeriesPosts(seriesName: string) {
  try {
    await dbConnect()
    const posts = await Post.find({ series: seriesName, published: true })
      .select('title slug seriesOrder')
      .sort({ seriesOrder: 1 })
      .lean()
    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching series posts:', error)
    return []
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

  const seriesPosts = post.series ? await getSeriesPosts(post.series) : []
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
      <PostAnimations />
      <TableOfContents content={post.content} />

      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <article>
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent text-sm font-bold"
              >
                &larr; back to posts
              </Link>
              <SocialShare title={post.title} slug={slug} />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <FormattedDate date={post.createdAt} />
              {isUpdated && (
                <>
                  <span className="text-accent">•</span>
                  <span className="italic font-medium">Last edited <FormattedDate date={post.updatedAt} /></span>
                </>
              )}
              <span className="text-accent">|</span>
              <span>{post.readTime} mins read</span>
              {post.views > 100 && (
                <>
                  <span className="text-accent">|</span>
                  <span className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-black uppercase brutal-border brutal-shadow animate-pulse">
                    <span>🔥</span> trending
                  </span>
                </>
              )}
            </div>
          </header>

          <ViewCounter slug={slug} />

          {seriesPosts.length > 0 && (
            <SeriesCard 
              currentSlug={slug} 
              seriesName={post.series} 
              posts={seriesPosts} 
            />
          )}

          <div className="brutal-border brutal-shadow bg-card p-6 md:p-8 mb-8">
            <MarkdownContent content={post.content} />
          </div>

          <div className="mb-12">
            <Newsletter />
          </div>

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

          <PostReactions 
            slug={slug} 
            initialReactions={post.reactions ? JSON.parse(JSON.stringify(post.reactions)) : {}} 
          />

          <GiscusComments />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t-4 border-foreground">
              <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <span className="text-accent">#</span> Related Topics
              </h2>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-4 py-2 bg-secondary text-secondary-foreground font-bold brutal-border brutal-shadow hover:bg-accent hover:text-accent-foreground transition-all hover:-translate-y-0.5"
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
