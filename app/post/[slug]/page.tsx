import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import { TableOfContents } from '@/components/TableOfContents'
import GiscusComments from '@/components/GiscusComments'
import { Newsletter } from '@/components/Newsletter'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getBaseUrl, cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar, Clock, BookOpen, Sparkles, Layers } from 'lucide-react'
import { PostReactions } from '@/components/PostReactions'
import { SocialShare } from '@/components/SocialShare'
import { FormattedDate } from '@/components/FormattedDate'
import { CommunityCallout } from '@/components/CommunityCallout'

// Enable ISR: Cache on Netlify Edge CDN, revalidating in background or on-demand via revalidatePath
export const revalidate = 60

// Static generation
export async function generateStaticParams() {
  try {
    await dbConnect()
    const posts = await Post.find({ published: true, isDraft: { $ne: true }, type: { $ne: 'note' } }).select('slug').lean()
    return posts.map((post: any) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
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
    const post = await Post.findOne({ slug, published: true, isDraft: { $ne: true } }).lean()
    return post ? JSON.parse(JSON.stringify(post)) : null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string, tags: string[]) {
  try {
    await dbConnect()
    let posts = await Post.find({
      published: true,
      isDraft: { $ne: true },
      slug: { $ne: currentSlug },
      tags: { $in: tags }
    })
    .select('title slug excerpt createdAt readTime tags')
    .limit(3)
    .lean()
    
    // Backfill with latest posts if fewer than 3 match tags to eliminate orphan links
    if (posts.length < 3) {
      const existingSlugs = [currentSlug, ...posts.map((p: any) => p.slug)]
      const fallback = await Post.find({
        published: true,
        isDraft: { $ne: true },
        slug: { $nin: existingSlugs }
      })
      .sort({ createdAt: -1 })
      .select('title slug excerpt createdAt readTime tags')
      .limit(3 - posts.length)
      .lean()

      posts = [...posts, ...fallback]
    }

    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

async function getSeriesArticles(seriesName?: string) {
  if (!seriesName) return []
  try {
    await dbConnect()
    const posts = await Post.find({
      series: seriesName,
      published: true,
      isDraft: { $ne: true }
    })
    .sort({ seriesOrder: 1, createdAt: 1 })
    .select('title slug seriesOrder')
    .lean()

    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching series articles:', error)
    return []
  }
}

async function getPrevNextPosts(createdAt: Date) {
  try {
    await dbConnect()
    const [prevPost, nextPost] = await Promise.all([
      Post.findOne({ published: true, isDraft: { $ne: true }, createdAt: { $lt: createdAt } })
        .sort({ createdAt: -1 })
        .select('slug title')
        .lean(),
      Post.findOne({ published: true, isDraft: { $ne: true }, createdAt: { $gt: createdAt } })
        .sort({ createdAt: 1 })
        .select('slug title')
        .lean()
    ])

    return {
      prev: prevPost ? String(prevPost.slug) : null,
      next: nextPost ? String(nextPost.slug) : null,
    }
  } catch (error) {
    console.error('Error fetching prev/next posts:', error)
    return { prev: null, next: null }
  }
}

// Metadata generation
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const baseUrl = getBaseUrl()
  const coverUrl = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`)
    : null
  const ogImageUrl = coverUrl || `${baseUrl}/post/${slug}/opengraph-image`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${baseUrl}/post/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.isGuest ? (post.authorName || 'Guest Author') : 'George Ongoro'],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  }
}

// Main component
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // If a note was requested on /post/, redirect to /note/
  if (post.type === 'note') {
    redirect(`/note/${slug}`)
  }

  const relatedPosts = await getRelatedPosts(slug, post.tags || [])
  const seriesArticles = await getSeriesArticles(post.series)
  const nav = await getPrevNextPosts(post.createdAt)
  const baseUrl = getBaseUrl()
  const coverUrl = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`)
    : null
  const ogImageUrl = coverUrl || `${baseUrl}/post/${slug}/opengraph-image`

  const isUpdated = post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 86400000

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/post/${slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `${baseUrl}/post/${slug}`,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/post/${slug}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'George Ongoro Blog',
          url: baseUrl,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/post/${slug}`,
        },
        headline: post.title,
        description: post.excerpt,
        image: [ogImageUrl],
        inLanguage: 'en-US',
        keywords: post.tags?.join(', '),
        wordCount: post.content ? post.content.split(/\s+/).length : undefined,
        datePublished: new Date(post.createdAt).toISOString(),
        dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
        author: {
          '@type': 'Person',
          name: post.isGuest ? (post.authorName || 'Guest Author') : 'George Ongoro',
          url: post.isGuest && post.authorBio ? (post.authorBio.startsWith('http') ? post.authorBio : `https://${post.authorBio}`) : `${baseUrl}/about`,
          sameAs: post.isGuest ? undefined : [
            'https://x.com/ongorogeorg_e',
            'https://github.com/004Ongoro',
            'https://linkedin.com/in/georgeongoro2',
          ],
        },
        publisher: {
          '@type': 'Person',
          '@id': `${baseUrl}/#person`,
          name: 'George Ongoro',
          url: `${baseUrl}/about`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-24 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between relative">
          
          {/* Main Reading Column */}
          <main className="flex-1 max-w-3xl w-full mx-auto lg:mx-0">
            {/* Top Navigation & Context Bar */}
            <nav aria-label="Breadcrumbs" className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border/50 text-xs font-mono">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group cursor-pointer font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Articles
              </Link>
              
              <div className="flex items-center gap-3">
                {post.series && (
                  <Link
                    href={`/series/${encodeURIComponent(post.series)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 hover:bg-accent/20 text-accent font-bold uppercase tracking-wider transition-colors text-[11px]"
                  >
                    <BookOpen size={12} />
                    <span>{post.series}</span>
                  </Link>
                )}
                <SocialShare title={post.title} slug={slug} />
              </div>
            </nav>

            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.18] mb-5 text-balance">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground font-normal leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Publication Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/60 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-extrabold text-sm border border-accent/20 shrink-0">
                    {post.isGuest ? (post.authorName ? post.authorName.charAt(0).toUpperCase() : 'G') : 'GO'}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-sans font-bold text-foreground text-sm leading-tight">
                      {post.isGuest ? (
                        post.authorBio ? (
                          <a 
                            href={post.authorBio.startsWith('http') ? post.authorBio : `https://${post.authorBio}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                          >
                            {post.authorName || 'Guest Author'}
                          </a>
                        ) : (
                          post.authorName || 'Guest Author'
                        )
                      ) : (
                        <Link href="/about" className="hover:text-accent transition-colors">
                          George Ongoro
                        </Link>
                      )}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {post.isGuest ? 'Guest Contributor' : 'Full-Stack Developer'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="opacity-70 text-accent" />
                    <FormattedDate date={post.createdAt} />
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="opacity-70 text-accent" />
                    {post.readTime} min read
                  </span>
                  {isUpdated && (
                    <>
                      <span className="text-border hidden sm:inline">•</span>
                      <span className="hidden sm:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                        Updated <FormattedDate date={post.updatedAt} />
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Table of Contents */}
              <div className="lg:hidden">
                <TableOfContents content={post.content} />
              </div>
            </header>

            {/* Markdown Body */}
            <article className="prose-brutal max-w-none">
              <MarkdownContent content={post.content} />
            </article>

            {/* Post-Article Engagement Section */}
            <div className="mt-16 space-y-12">
              {/* Reactions */}
              <div className="pt-6 border-t border-border/50">
                <PostReactions 
                  slug={slug} 
                  initialReactions={post.reactions ? JSON.parse(JSON.stringify(post.reactions)) : {}} 
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-mono uppercase font-bold text-muted-foreground/60 mr-2">Tags:</span>
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/tags?tag=${encodeURIComponent(tag)}`}
                      className="text-xs font-mono font-medium px-3 py-1 rounded-lg bg-secondary/60 hover:bg-accent/15 hover:text-accent text-muted-foreground border border-border/50 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Previous / Next Article Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/60">
                {nav.prev ? (
                  <Link
                    href={`/post/${nav.prev}`}
                    className="group p-5 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-accent/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 group-hover:text-accent transition-colors">
                      <ChevronLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                      Previous Article
                    </span>
                    <p className="font-sans font-bold text-foreground text-sm line-clamp-2 leading-snug mt-2 group-hover:text-accent transition-colors">
                      {nav.prev.replace(/-/g, ' ')}
                    </p>
                  </Link>
                ) : <div />}

                {nav.next ? (
                  <Link
                    href={`/post/${nav.next}`}
                    className="group p-5 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-accent/40 transition-all flex flex-col justify-between sm:text-right"
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center sm:justify-end gap-1.5 group-hover:text-accent transition-colors">
                      Next Article
                      <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <p className="font-sans font-bold text-foreground text-sm line-clamp-2 leading-snug mt-2 group-hover:text-accent transition-colors">
                      {nav.next.replace(/-/g, ' ')}
                    </p>
                  </Link>
                ) : <div />}
              </div>

              {/* More Readings Grid */}
              {relatedPosts && relatedPosts.length > 0 && (
                <section className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Sparkles size={14} className="text-accent" />
                      More Readings
                    </h2>
                    <Link href="/" className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors">
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedPosts.map((rPost: any) => (
                      <Link
                        key={rPost.slug}
                        href={`/post/${rPost.slug}`}
                        className="group p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card hover:border-accent/40 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">
                            {rPost.readTime ? `${rPost.readTime} min read` : 'Article'}
                          </span>
                          <h3 className="text-xs font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                            {rPost.title}
                          </h3>
                        </div>
                        {rPost.excerpt && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                            {rPost.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Newsletter & Community Callout */}
              <div className="space-y-8 pt-4">
                <Newsletter />
                <CommunityCallout />
              </div>

              {/* Comments Section */}
              <div className="pt-6">
                <GiscusComments />
              </div>
            </div>
          </main>

          {/* Sticky Right Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start space-y-8 pl-6 border-l border-border/40 text-xs">
            {/* Table of Contents */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
                <Layers size={12} className="text-accent" />
                On this page
              </h3>
              <TableOfContents content={post.content} isSidebar />
            </div>

            {/* Series Navigation (if article is in a series) */}
            {seriesArticles.length > 1 && (
              <div className="space-y-3 pt-6 border-t border-border/40">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
                  <BookOpen size={12} className="text-accent" />
                  Series: {post.series}
                </h3>
                <ol className="space-y-1.5 font-mono">
                  {seriesArticles.map((sPost: any, index: number) => {
                    const isCurrent = sPost.slug === slug
                    return (
                      <li key={sPost.slug}>
                        <Link
                          href={`/post/${sPost.slug}`}
                          className={cn(
                            "flex items-start gap-2 p-2 rounded-lg transition-colors leading-tight",
                            isCurrent
                              ? "bg-accent/15 text-accent font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                          )}
                        >
                          <span className="shrink-0 text-[10px] opacity-70">
                            {index + 1}.
                          </span>
                          <span className="line-clamp-2 font-sans font-medium text-xs">
                            {sPost.title}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )}

            {/* Quick Share Widget */}
            <div className="space-y-3 pt-6 border-t border-border/40">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70 block">
                Share Article
              </span>
              <SocialShare title={post.title} slug={slug} />
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  )
}
