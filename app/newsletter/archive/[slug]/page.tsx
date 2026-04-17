import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = false

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
    description: `Newsletter issue archived from George Ongoro's blog.`,
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <Link
          href="/newsletter/archive"
          className="text-muted-foreground hover:text-accent text-sm mb-6 inline-block font-bold"
        >
          &larr; back to archive
        </Link>
        
        <article className="brutal-border brutal-shadow bg-card overflow-hidden">
          <header className="bg-accent p-6 border-b-4 border-foreground">
            <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight">
              {issue.subject}
            </h1>
            <p className="font-bold mt-2 text-accent-foreground/80">
              Published on {formatDate(issue.createdAt)}
            </p>
          </header>

          <div className="p-6 md:p-10">
            {issue.isMarkdown ? (
              <MarkdownContent content={issue.content} />
            ) : (
              <div className="whitespace-pre-wrap font-mono text-lg">
                {issue.content}
              </div>
            )}
          </div>

          <footer className="bg-secondary p-6 border-t-4 border-foreground">
            <p className="font-black uppercase text-sm mb-4">Enjoyed this issue?</p>
            <Link 
              href="/newsletter"
              className="brutal-btn bg-accent text-accent-foreground px-6 py-3 font-black uppercase inline-block text-center w-full sm:w-auto"
            >
              Subscribe for More
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  )
}