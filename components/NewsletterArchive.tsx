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
          className="w-full bg-transparent border-b border-foreground/5 py-4 pl-8 pr-4 font-medium focus:border-accent outline-none placeholder:text-muted-foreground/20 transition-all"
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
            className="group block space-y-4"
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
            <div className="border-2 border-dashed border-foreground/10 p-12 text-center rounded-lg">
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                {search ? "No dispatches match your search." : "No other dispatches found."}
              </p>
            </div>
          ) : (
            otherIssues.map((issue, index) => {
              const issueNumber = issues.length - (search ? issues.indexOf(issue) : index + 1)
              return (
                <article key={issue._id} className="group border-b border-foreground/5 py-8 first:pt-0 last:border-0">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        <span>#{issueNumber.toString().padStart(3, '0')}</span>
                        <span className="h-1 w-1 rounded-full bg-foreground/10" />
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

      {/* Subscribe CTA */}
      <section className="bg-foreground text-background p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
        
        <div className="relative z-10 max-w-lg">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">
            Get them <span className="text-accent italic">Live</span>
          </h3>
          <p className="text-sm font-medium opacity-70 mb-8 leading-relaxed">
            Don't wait for the archive. Join developers worldwide receiving these insights directly in their inbox.
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
