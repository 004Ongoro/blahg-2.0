import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { FormattedDate } from '@/components/FormattedDate'
import { SocialShare } from '@/components/SocialShare'
import { Mail, ArrowLeft, Calendar, User, ChevronLeft } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  try {
    await dbConnect()
    const issues = await NewsletterIssue.find({ published: true }).select('slug').lean()
    return issues.map((issue: any) => ({
      slug: issue.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getIssue(slug: string) {
  await dbConnect()
  const issue = await NewsletterIssue.findOne({ slug, published: true }).lean()
  return issue ? JSON.parse(JSON.stringify(issue)) : null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const issue = await getIssue(slug)
  
  if (!issue) return { title: 'Issue Not Found' }
  
  const ogImageUrl = `/api/og?title=${encodeURIComponent(issue.subject)}`
  
  return {
    title: issue.subject,
    description: `A newsletter issue from George Ongoro's underground dev circle.`,
    openGraph: {
      title: issue.subject,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
  }
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { slug } = await params
  const issue = await getIssue(slug)

  if (!issue) notFound()

  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <Header />
      
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 md:py-24 w-full">
        <header className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <Link
              href="/newsletter/archive"
              className="text-muted-foreground hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> dispatches
            </Link>
            <SocialShare title={issue.subject} slug={`newsletter/archive/${slug}`} />
          </div>
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              <Mail size={12} />
              Dispatch
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
              {issue.subject}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground/60">
              <FormattedDate date={issue.createdAt} />
              <span className="h-1 w-1 rounded-full bg-foreground/10" />
              <span>George Ongoro</span>
            </div>
          </div>
        </header>

        <article className="mb-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {issue.isMarkdown ? (
              <MarkdownContent content={issue.content} />
            ) : (
              <div className="whitespace-pre-wrap font-mono text-lg leading-relaxed">
                {issue.content}
              </div>
            )}
          </div>
        </article>

        <footer className="space-y-12">
          {/* Subscribe CTA */}
          <section className="bg-foreground text-background p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none">
                Get the next one <span className="text-accent italic">Live</span>
              </h3>
              <p className="text-sm font-medium opacity-70 mb-8 leading-relaxed max-w-md">
                Don't wait for the archive. Join developers worldwide receiving these insights directly in their inbox every week.
              </p>
              <Link 
                href="/newsletter"
                className="bg-accent text-accent-foreground px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all inline-flex items-center gap-2"
              >
                Join the underground <Mail size={14} />
              </Link>
            </div>
          </section>

        {/* Navigation bottom */}
        <div className="flex justify-center">
          <Link
            href="/newsletter/archive"
            className="brutal-border px-6 py-3 font-black uppercase text-sm hover:bg-muted transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> All Issues
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
