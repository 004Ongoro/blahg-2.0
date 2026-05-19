import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'
import { NewsletterArchive } from '@/components/NewsletterArchive'

export const dynamic = 'force-static'
export const revalidate = false

async function getIssues() {
  await dbConnect()
  const issues = await NewsletterIssue.find({ published: true })
    .sort({ createdAt: -1 })
    .lean()
  return JSON.parse(JSON.stringify(issues))
}

export default async function NewsletterArchivePage() {
  const issues = await getIssues()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 italic leading-none">
            Issue <span className="text-accent">Archive</span>
          </h1>
          <p className="text-xl font-bold text-muted-foreground max-w-2xl">
            A collection of past insights on performance, architecture, and the business of software.
          </p>
        </div>
        
        <NewsletterArchive issues={issues} />
      </main>
      <Footer />
    </div>
  )
}