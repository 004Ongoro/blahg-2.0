'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Mail, Calendar } from 'lucide-react'
import { FormattedDate } from '@/components/FormattedDate'

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
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for an issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full brutal-border bg-card py-4 pl-12 pr-4 font-bold text-lg focus:ring-4 ring-accent outline-none placeholder:opacity-50 transition-all"
        />
      </div>

      {/* Featured Latest Issue (only if not searching) */}
      {!search && latestIssue && (
        <section className="animate-fade-in">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-accent"></span>
            Latest Release
          </h2>
          <Link 
            href={`/newsletter/archive/${latestIssue.slug}`}
            className="block brutal-border bg-accent text-accent-foreground p-8 brutal-shadow hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mail size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-block bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase">
                  Issue #{(issues.length).toString().padStart(3, '0')}
                </div>
                <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-tight">
                  {latestIssue.subject}
                </h3>
                <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                  <Calendar size={16} />
                  <FormattedDate date={latestIssue.createdAt} />
                </div>
              </div>
              <div className="flex items-center gap-2 font-black uppercase text-xl group-hover:translate-x-4 transition-transform whitespace-nowrap">
                Read Issue <ArrowRight size={24} />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Issues Grid */}
      <section>
        {search && (
          <h2 className="text-2xl font-black uppercase italic mb-8">
            Found {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'} for "{search}"
          </h2>
        )}
        {!search && (
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-foreground"></span>
            Previous Issues
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                      {issue.subject}
                    </h3>
                  </div>
                  <div className="mt-6 flex items-center justify-end text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    <span className="font-black uppercase text-xs mr-2">Read</span>
                    <ArrowRight size={18} />
                  </div>
                </Link>
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
            className="brutal-btn bg-accent text-accent-foreground px-10 py-4 font-black uppercase inline-block text-xl"
          >
            Join the underground
          </Link>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12">
          <Mail size={240} />
        </div>
      </section>
    </div>
  )
}