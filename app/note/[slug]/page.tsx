import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import GiscusComments from '@/components/GiscusComments'
import { Newsletter } from '@/components/Newsletter'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getBaseUrl } from '@/lib/utils'
import { ChevronLeft, Calendar, Clock, User, Zap, ArrowLeft } from 'lucide-react'
import { PostReactions } from '@/components/PostReactions'
import { SocialShare } from '@/components/SocialShare'
import { FormattedDate } from '@/components/FormattedDate'

// Enable ISR: Cache on Netlify Edge CDN, revalidating in background or on-demand via revalidatePath
export const revalidate = 60

export async function generateStaticParams() {
  try {
    await dbConnect()
    const notes = await Post.find({ published: true, isDraft: { $ne: true }, type: 'note' }).select('slug').lean()
    return notes.map((note: any) => ({
      slug: note.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for notes:', error)
    return []
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getNote(slug: string) {
  try {
    await dbConnect()
    const post = await Post.findOne({ slug, published: true, isDraft: { $ne: true } }).lean()
    return post ? JSON.parse(JSON.stringify(post)) : null
  } catch (error) {
    console.error('Error fetching note:', error)
    return null
  }
}

async function getRelatedNotes(currentSlug: string, tags: string[]) {
  try {
    await dbConnect()
    let posts = await Post.find({
      published: true,
      isDraft: { $ne: true },
      slug: { $ne: currentSlug },
      tags: { $in: tags }
    })
    .select('title slug excerpt createdAt readTime tags type')
    .limit(3)
    .lean()
    
    if (posts.length < 3) {
      const existingSlugs = [currentSlug, ...posts.map((p: any) => p.slug)]
      const fallback = await Post.find({
        published: true,
        isDraft: { $ne: true },
        slug: { $nin: existingSlugs }
      })
      .sort({ createdAt: -1 })
      .select('title slug excerpt createdAt readTime tags type')
      .limit(3 - posts.length)
      .lean()

      posts = [...posts, ...fallback]
    }

    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    console.error('Error fetching related notes:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const note = await getNote(slug)

  if (!note) {
    return { title: 'Note Not Found' }
  }

  const baseUrl = getBaseUrl()
  const ogImageUrl = `${baseUrl}/note/${slug}/opengraph-image`

  return {
    title: note.title,
    description: note.excerpt,
    alternates: {
      canonical: `${baseUrl}/note/${slug}`,
    },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      type: 'article',
      publishedTime: note.createdAt,
      authors: [note.isGuest ? (note.authorName || 'Guest Author') : 'George Ongoro'],
      tags: note.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      description: note.excerpt,
      images: [ogImageUrl],
    },
  }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params
  const note = await getNote(slug)

  if (!note) {
    notFound()
  }

  // If a long-form article was requested on /note/, redirect to /post/
  if (note.type === 'post') {
    redirect(`/post/${slug}`)
  }

  const relatedNotes = await getRelatedNotes(slug, note.tags || [])
  const baseUrl = getBaseUrl()
  const ogImageUrl = `${baseUrl}/note/${slug}/opengraph-image`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/note/${slug}#breadcrumb`,
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
            name: 'Notes',
            item: `${baseUrl}/?filter=notes`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: note.title,
            item: `${baseUrl}/note/${slug}`,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/note/${slug}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'George Ongoro Blog',
          url: baseUrl,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/note/${slug}`,
        },
        headline: note.title,
        description: note.excerpt,
        image: [ogImageUrl],
        inLanguage: 'en-US',
        keywords: note.tags?.join(', '),
        wordCount: note.content ? note.content.split(/\s+/).length : undefined,
        datePublished: new Date(note.createdAt).toISOString(),
        dateModified: new Date(note.updatedAt || note.createdAt).toISOString(),
        author: {
          '@type': 'Person',
          name: note.isGuest ? (note.authorName || 'Guest Author') : 'George Ongoro',
          url: note.isGuest && note.authorBio ? (note.authorBio.startsWith('http') ? note.authorBio : `https://${note.authorBio}`) : `${baseUrl}/about`,
          sameAs: note.isGuest ? undefined : [
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
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full space-y-10">
        {/* Navigation & Actions Top Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <Link
            href="/?filter=notes"
            className="text-muted-foreground hover:text-accent font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Notes
          </Link>
          <div className="flex items-center gap-3">
            <SocialShare title={note.title} slug={`note/${slug}`} />
          </div>
        </div>

        {/* Note Article Body Card */}
        <article className="border border-border bg-card/70 backdrop-blur-xs rounded-2xl p-6 md:p-10 shadow-xs space-y-8">
          {/* Header Metadata */}
          <header className="space-y-4 border-b border-border/40 pb-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-mono font-bold uppercase tracking-wider">
                <Zap size={12} />
                <span>Short Note</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-mono font-semibold uppercase tracking-wider">
                <Clock size={11} className="opacity-70" />
                <span>&lt; 30s read</span>
              </span>

              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground ml-auto">
                <Calendar size={11} className="opacity-70" />
                <FormattedDate date={note.createdAt} />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-sans font-black tracking-tight leading-snug text-foreground">
              {note.title}
            </h1>

            {/* Author Credit */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-mono font-extrabold text-xs border border-accent/20 shrink-0">
                {note.isGuest ? (note.authorName ? note.authorName.charAt(0).toUpperCase() : 'G') : 'GO'}
              </div>
              <div className="text-xs font-mono">
                <span className="text-muted-foreground">Written by </span>
                <span className="font-bold text-foreground">
                  {note.isGuest ? (note.authorName || 'Guest Author') : 'George Ongoro'}
                </span>
              </div>
            </div>
          </header>

          {/* Markdown Content */}
          <div className="prose-brutal text-base leading-relaxed">
            <MarkdownContent content={note.content} />
          </div>

          {/* Tags Chips */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
              {note.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tags?tag=${encodeURIComponent(tag)}`}
                  className="text-xs font-mono font-medium text-muted-foreground hover:text-accent transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Related Notes and Articles */}
        {relatedNotes && relatedNotes.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">
              Related Writings &amp; Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {relatedNotes.map((item: any) => (
                <Link
                  key={item.slug}
                  href={item.type === 'note' ? `/note/${item.slug}` : `/post/${item.slug}`}
                  className="p-4 border border-border/60 bg-card/50 hover:bg-card hover:border-accent/30 transition-all rounded-xl flex flex-col justify-between group"
                >
                  <span className="text-[10px] font-mono text-accent uppercase font-bold mb-1">
                    {item.type === 'note' ? 'Note' : 'Article'}
                  </span>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Engagement: Reactions & Comments */}
        <div className="space-y-10 pt-4">
          <PostReactions
            slug={slug}
            initialReactions={note.reactions ? JSON.parse(JSON.stringify(note.reactions)) : {}}
          />

          <Newsletter />

          <GiscusComments />
        </div>
      </main>

      <Footer />
    </div>
  )
}
