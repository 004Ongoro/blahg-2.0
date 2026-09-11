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
import { ChevronLeft, ChevronRight, Calendar, Clock, User, BookOpen } from 'lucide-react'
import { PostReactions } from '@/components/PostReactions'
import { MoreLikeThis } from '@/components/MoreLikeThis'
import { SocialShare } from '@/components/SocialShare'
import { FormattedDate } from '@/components/FormattedDate'
import { CommunityCallout } from '@/components/CommunityCallout'
import { GooglePreferredSourceButton } from '@/components/GooglePreferredSourceButton'


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
    const post = await Post.findOne({ slug, published: true }).lean()
    return post ? JSON.parse(JSON.stringify(post)) : null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string, tags: string[]) {
  try {
    await dbConnect()
    const posts = await Post.find({
      published: true,
      slug: { $ne: currentSlug },
      tags: { $in: tags }
    })
    .select('title slug excerpt createdAt readTime tags')
    .limit(3)
    .lean()
    
    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

async function getPrevNextPosts(createdAt: Date) {
  try {
    await dbConnect()
    const [prevPost, nextPost] = await Promise.all([
      Post.findOne({ published: true, createdAt: { $lt: createdAt } })
        .sort({ createdAt: -1 })
        .select('slug title')
        .lean(),
      Post.findOne({ published: true, createdAt: { $gt: createdAt } })
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

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.isGuest ? (post.authorName || 'Guest Author') : 'George Ongoro'],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`,
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
      images: [post.coverImage || `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`],
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

  const relatedPosts = await getRelatedPosts(slug, post.tags || [])
  const nav = await getPrevNextPosts(post.createdAt)
  const baseUrl = getBaseUrl()

  const isUpdated = post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 86400000

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/post/${slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : [`${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`],
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
      '@type': 'Organization',
      name: 'George Ongoro Blog',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/api/og?title=George+Ongoro`,
      },
    },
  }

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
          <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-24 self-start w-52 shrink-0 text-xs font-sans text-muted-foreground">
            <Link
              href="/"
              className="text-foreground hover:text-accent font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors pb-4 border-b border-border"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Articles
            </Link>
            
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User size={12} className="opacity-70" /> Author
              </span>
              <p className="font-sans font-bold text-foreground text-sm">
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
                  'George Ongoro'
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar size={12} className="opacity-70" /> Published
              </span>
              <p className="font-mono font-bold text-foreground text-xs"><FormattedDate date={post.createdAt} /></p>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock size={12} className="opacity-70" /> Read Time
              </span>
              <p className="font-mono font-bold text-foreground text-xs">{post.readTime} min read</p>
            </div>

            {isUpdated && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock size={12} className="opacity-70" /> Updated
                </span>
                <p className="font-mono font-semibold text-muted-foreground text-xs"><FormattedDate date={post.updatedAt} /></p>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-border">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block">
                Share Article
              </span>
              <SocialShare title={post.title} slug={slug} />
            </div>

            {(nav.prev || nav.next) && (
              <div className="space-y-3 pt-4 border-t border-border">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block">Navigation</span>
                <div className="space-y-3">
                  {nav.prev && (
                    <Link href={`/post/${nav.prev}`} className="group block space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70 block">← Previous</span>
                      <span className="font-sans font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight block text-xs">
                        {nav.prev.replace(/-/g, ' ')}
                      </span>
                    </Link>
                  )}
                  {nav.next && (
                    <Link href={`/post/${nav.next}`} className="group block space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70 block">Next →</span>
                      <span className="font-sans font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight block text-xs">
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
            <header className="mb-10">
              {/* Mobile Back Link & Social Share Header */}
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-accent text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Articles
                </Link>
                <SocialShare title={post.title} slug={slug} />
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-black tracking-tight mb-6 leading-[1.15] text-foreground">
                {post.title}
              </h1>

              {/* Clean Article Header Metadata Card */}
              <div className="border border-border bg-card/70 backdrop-blur-xs p-4 md:p-5 rounded-2xl shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-mono font-extrabold text-sm border border-accent/20 shrink-0">
                    {post.isGuest ? (post.authorName ? post.authorName.charAt(0).toUpperCase() : 'G') : 'GO'}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-sans font-bold text-foreground leading-tight">
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
                        'George Ongoro'
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="opacity-70" />
                        <FormattedDate date={post.createdAt} />
                      </span>
                      <span className="h-1 w-1 rounded-full bg-accent/40" />
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="opacity-70" />
                        {post.readTime} min read
                      </span>
                      {isUpdated && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-accent/40" />
                          <span className="italic text-[11px]">Updated <FormattedDate date={post.updatedAt} /></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {post.series && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
                      <BookOpen size={12} />
                      <span>{post.series}</span>
                    </span>
                  )}
                  <GooglePreferredSourceButton />
                </div>
              </div>
            </header>

            <div className="prose-brutal">
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

            <GooglePreferredSourceButton />
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
