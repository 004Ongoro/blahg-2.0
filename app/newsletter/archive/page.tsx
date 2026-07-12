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
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 md:py-24 w-full">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">
            Dispatches
          </h1>
          <p className="text-muted-foreground font-medium">
            Past insights on performance, architecture, and the business of software.
          </p>
        </header>
        
        <NewsletterArchive issues={issues} />
      </main>
      <Footer />
    </div>
  )
}
