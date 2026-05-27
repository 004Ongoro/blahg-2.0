import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { FormattedDate } from '@/components/FormattedDate'
import { SocialShare } from '@/components/SocialShare'
import { Mail, ArrowLeft, Calendar, User } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/newsletter/archive"
              className="group flex items-center gap-2 text-muted-foreground hover:text-accent font-black uppercase text-xs transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              back to archive
            </Link>
            <SocialShare title={issue.subject} slug={`newsletter/archive/${slug}`} />
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 text-xs font-black uppercase brutal-border-sm">
              <Mail size={14} />
              Newsletter Issue
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-[0.9] tracking-tighter text-balance">
              {issue.subject}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground pt-4 border-t-4 border-foreground/10">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-accent" />
                <FormattedDate date={issue.createdAt} />
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-accent" />
                <span>George Ongoro</span>
              </div>
            </div>
          </div>
        </header>

        <article className="brutal-border brutal-shadow bg-card overflow-hidden mb-16">
          <div className="p-6 md:p-12">
            {issue.isMarkdown ? (
              <MarkdownContent content={issue.content} />
            ) : (
              <div className="whitespace-pre-wrap font-mono text-lg leading-relaxed">
                {issue.content}
              </div>
            )}
          </div>

          <footer className="bg-foreground text-background p-8 md:p-12 border-t-4 border-foreground">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black uppercase italic mb-4 leading-none">
                Get the next one <span className="text-accent">Live</span>
              </h2>
              <p className="text-lg font-bold mb-8 opacity-80">
                Don't wait for the archive. Join developers worldwide receiving these insights directly in their inbox every week.
              </p>
              <Link 
                href="/newsletter"
                className="brutal-btn bg-accent text-accent-foreground px-8 py-4 font-black uppercase inline-flex items-center gap-3 text-xl"
              >
                Join the circle <Mail size={24} />
              </Link>
            </div>
          </footer>
        </article>

        {/* Navigation bottom */}
        <div className="flex justify-center">
          <Link
            href="/newsletter/archive"
            className="brutal-border px-6 py-3 font-black uppercase text-sm hover:bg-muted transition-colors flex items-center gap-2 shadow-[4px_4px_0px_#000]"
          >
            <ArrowLeft size={16} /> All Issues
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
