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
import { GooglePreferredSourceButton } from '@/components/GooglePreferredSourceButton'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  try {
    await dbConnect()
    const notes = await Post.find({ published: true, type: 'note' }).select('slug').lean()
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
    const post = await Post.findOne({ slug, published: true }).lean()
    return post ? JSON.parse(JSON.stringify(post)) : null
  } catch (error) {
    console.error('Error fetching note:', error)
    return null
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

  const baseUrl = getBaseUrl()
  const ogImageUrl = `${baseUrl}/note/${slug}/opengraph-image`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
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
            <GooglePreferredSourceButton />
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
