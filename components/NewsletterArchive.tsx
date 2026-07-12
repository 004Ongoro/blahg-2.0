'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Mail, Calendar } from 'lucide-react'
import { FormattedDate } from '@/components/FormattedDate'
import { cn } from '@/lib/utils'

interface Issue {
  _id: string
  subject: string
  slug: string
  createdAt: string
  isMarkdown: boolean
}

interface NewsletterArchiveProps {
  issues: Issue[]
}

export function NewsletterArchive({ issues }: NewsletterArchiveProps) {
  const [search, setSearch] = useState('')

  const filteredIssues = issues.filter((issue) =>
    issue.subject.toLowerCase().includes(search.toLowerCase())
  )

  const latestIssue = issues[0]
  const otherIssues = search ? filteredIssues : filteredIssues.slice(1)

  return (
    <div className="space-y-16">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Find a specific dispatch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full brutal-border bg-card py-4 pl-12 pr-4 font-bold text-lg focus:ring-4 ring-accent outline-none placeholder:opacity-50 transition-all"
        />
      </div>

      {/* Featured Latest Issue (only if not searching) */}
      {!search && latestIssue && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Latest Dispatch</span>
            <div className="h-px flex-1 bg-foreground/5" />
          </div>
          
          <Link 
            href={`/newsletter/archive/${latestIssue.slug}`}
            className="block brutal-border bg-accent text-accent-foreground p-8 brutal-shadow hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Issue #{(issues.length).toString().padStart(3, '0')}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/10" />
                <FormattedDate date={latestIssue.createdAt} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors leading-none">
                {latestIssue.subject}
              </h3>
            </div>
            
            <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm">
              Read the full issue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        </section>
      )}

      {/* Issues Grid */}
      <section>
        <div className="mb-10 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            {search ? `Search results (${filteredIssues.length})` : 'Previous Issues'}
          </span>
          <div className="h-px flex-1 bg-foreground/5" />
        </div>

        <div className="flex flex-col">
          {otherIssues.length === 0 ? (
            <div className="col-span-full brutal-border p-12 bg-card text-center font-bold italic text-muted-foreground">
              {search ? "No issues match your search." : "No other issues found."}
            </div>
          ) : (
            otherIssues.map((issue, index) => {
              const issueNumber = issues.length - (search ? issues.indexOf(issue) : index + 1)
              return (
                <Link 
                  key={issue._id} 
                  href={`/newsletter/archive/${issue.slug}`}
                  className="brutal-border bg-card p-6 brutal-shadow hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase bg-muted px-2 py-1">
                        Issue #{issueNumber.toString().padStart(3, '0')}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        <FormattedDate date={issue.createdAt} />
                      </div>

                      <Link href={`/newsletter/archive/${issue.slug}`} className="block group-hover:text-accent transition-colors">
                        <h4 className="text-xl font-black uppercase tracking-tighter leading-tight">
                          {issue.subject}
                        </h4>
                      </Link>
                    </div>

                    <Link 
                      href={`/newsletter/archive/${issue.slug}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/5 bg-background transition-all group-hover:bg-accent group-hover:text-accent-foreground md:mt-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {/* Subscribe Footer CTA */}
      <section className="mt-20 p-12 brutal-border bg-secondary text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase italic mb-4">Missing out on the next one?</h2>
          <p className="text-lg font-bold mb-8 max-w-xl mx-auto">
            Get these insights delivered straight to your inbox before they hit the archive.
          </p>
          <Link 
            href="/newsletter"
            className="bg-accent text-accent-foreground px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 w-full sm:w-auto inline-flex"
          >
            Join the underground <Mail size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
