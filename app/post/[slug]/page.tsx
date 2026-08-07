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
import { CommunityCallout } from '@/components/CommunityCallout'

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
      name: post.isGuest ? (post.authorName || 'Guest Author') : 'George Ongoro',
      url: post.isGuest && post.authorBio ? (post.authorBio.startsWith('http') ? post.authorBio : `https://${post.authorBio}`) : baseUrl,
    },
  }

  const isUpdated = post.updatedAt && 
    new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 1000 * 60 * 5

  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-24 w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center relative">
          
          {/* Left Column: Sticky Metadata & Socials */}
          <aside className="hidden lg:flex flex-col gap-8 lg:sticky lg:top-24 self-start w-48 shrink-0 text-xs font-sans text-muted-foreground/80">
            <Link
              href="/"
              className="text-muted-foreground hover:text-accent font-bold uppercase tracking-wider flex items-center gap-1 transition-colors pb-4 border-b border-foreground/5"
            >
              <ChevronLeft className="h-4 w-4" /> back to logs
            </Link>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Author</span>
              <p className="font-bold text-foreground">
                {post.isGuest ? (
                  post.authorBio ? (
                    <a 
                      href={post.authorBio.startsWith('http') ? post.authorBio : `https://${post.authorBio}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline break-words"
                    >
                      {post.authorName || 'Guest Author'}
                    </a>
                  ) : (
                    post.authorName || 'Guest Author'
                  )
                ) : (
                  'George Ongoro'
                )}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Published</span>
              <p className="font-bold text-foreground"><FormattedDate date={post.createdAt} /></p>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Reading Time</span>
              <p className="font-bold text-foreground">{post.readTime} min read</p>
            </div>

            {isUpdated && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Updated</span>
                <p className="font-bold text-foreground/60"><FormattedDate date={post.updatedAt} /></p>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-foreground/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 block">Share</span>
              <SocialShare title={post.title} slug={slug} />
            </div>

            {(nav.prev || nav.next) && (
              <div className="space-y-4 pt-4 border-t border-foreground/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 block">Navigation</span>
                <div className="space-y-4">
                  {nav.prev && (
                    <Link href={`/post/${nav.prev}`} className="group block space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 block">← Previous</span>
                      <span className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight block normal-case">
                        {nav.prev.replace(/-/g, ' ')}
                      </span>
                    </Link>
                  )}
                  {nav.next && (
                    <Link href={`/post/${nav.next}`} className="group block space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 block">Next →</span>
                      <span className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight block normal-case">
                        {nav.next.replace(/-/g, ' ')}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Center Column: The Main Article */}
          <article className="flex-1 max-w-2xl w-full">
            <TableOfContents content={post.content} />
            <header className="mb-12">
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> posts
                </Link>
                <SocialShare title={post.title} slug={slug} />
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight mb-6 leading-tight text-balance">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground/60 lg:hidden">
                <span>By {post.isGuest ? (post.authorName || 'Guest Author') : 'George Ongoro'}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/10" />
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

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <MarkdownContent content={post.content} />
            </div>
          </article>

          {/* Right Column: Sticky Table of Contents & Related Posts */}
          <aside className="hidden lg:block lg:sticky lg:top-24 self-start w-60 shrink-0 space-y-10">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-b border-foreground/10 pb-2">Table of Contents</h3>
              <TableOfContents content={post.content} isSidebar />
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-b border-foreground/10 pb-2">More Like This</h3>
                <ul className="space-y-3">
                  {relatedPosts.map((rPost: any) => (
                    <li key={rPost.slug}>
                      <Link 
                        href={`/post/${rPost.slug}`}
                        className="group block"
                      >
                        <span className="text-xs font-extrabold text-foreground group-hover:text-accent transition-colors leading-snug block">
                          {rPost.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href="https://www.google.com/search?q=site%3Acode.geohack.top"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-background/80 hover:bg-foreground/5 text-xs font-bold text-foreground transition-all cursor-pointer w-fit"
              title="Follow on Google"
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-wider">Follow on Google</span>
            </a>
          </aside>

        </div>

        {/* Post-Article Engagement Section (Unsticky Sidebars Scroll Out Cleanly Here) */}
        <div className="max-w-2xl mx-auto w-full mt-16 space-y-12">
          {/* Post Reactions */}
          <PostReactions 
            slug={slug} 
            initialReactions={post.reactions ? JSON.parse(JSON.stringify(post.reactions)) : {}} 
          />

          {/* Prev / Next Navigation */}
          <div className="flex flex-col gap-8 py-8 border-y border-foreground/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nav.prev ? (
                <Link href={`/post/${nav.prev}`} className="group space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Previous Article</span>
                  <p className="font-extrabold group-hover:text-accent transition-colors flex items-center gap-2 leading-tight">
                    <ChevronLeft className="h-4 w-4 shrink-0" /> {nav.prev.replace(/-/g, ' ')}
                  </p>
                </Link>
              ) : <div />}

              {nav.next ? (
                <Link href={`/post/${nav.next}`} className="group space-y-1.5 md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Next Article</span>
                  <p className="font-extrabold group-hover:text-accent transition-colors flex items-center gap-2 md:justify-end leading-tight">
                    {nav.next.replace(/-/g, ' ')} <ChevronRight className="h-4 w-4 shrink-0" />
                  </p>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Newsletter & Community Callout */}
          <div className="space-y-8">
            <Newsletter />
            <CommunityCallout />
          </div>

          {/* Mobile Related Posts */}
          <div className="lg:hidden">
            <MoreLikeThis posts={relatedPosts} />
          </div>

          {/* Comments Section (Uncollapsed) */}
          <GiscusComments />

          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 border-t border-foreground/10">
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
