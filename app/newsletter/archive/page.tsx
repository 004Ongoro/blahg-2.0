import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = 3600

async function getIssues() {
  await dbConnect()
  return await NewsletterIssue.find({ published: true })
    .sort({ createdAt: -1 })
    .lean()
}

export default async function NewsletterArchivePage() {
  const issues = await getIssues()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-black uppercase mb-8 italic">
          Issue <span className="text-accent">Archive</span>
        </h1>
        
        <div className="grid gap-6">
          {issues.length === 0 ? (
            <div className="brutal-border p-8 bg-card text-center font-bold italic text-muted-foreground">
              No issues have been archived yet.
            </div>
          ) : (
            issues.map((issue: any) => (
              <Link 
                key={issue._id} 
                href={`/newsletter/archive/${issue.slug}`}
                className="brutal-border bg-card p-6 brutal-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#000] transition-all group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase group-hover:text-accent transition-colors">
                      {issue.subject}
                    </h2>
                    <p className="text-sm font-bold text-muted-foreground mt-1">
                      {formatDate(issue.createdAt)}
                    </p>
                  </div>
                  <span className="text-accent font-black text-2xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}