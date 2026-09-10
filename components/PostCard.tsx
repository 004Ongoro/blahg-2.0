'use client'

import Link from 'next/link'
import { FormattedDate } from './FormattedDate'
import { ArrowUpRight } from 'lucide-react'

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  createdAt: Date
  readTime: number
  tags: string[]
}

export function PostCard({
  title,
  slug,
  excerpt,
  createdAt,
  readTime,
  tags,
}: PostCardProps) {
  return (
    <article className="group relative border border-border bg-card/80 backdrop-blur-xs p-6 md:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            <FormattedDate date={createdAt} />
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            <span>{readTime} min read</span>
          </div>

          {/* Article Title */}
          <Link
            href={`/post/${slug}`}
            className="block group-hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <h2 className="text-xl md:text-2xl font-sans font-bold text-foreground tracking-tight leading-snug">
              {title}
            </h2>
          </Link>

          {/* Article Excerpt */}
          <p className="line-clamp-2 text-sm md:text-base leading-relaxed text-muted-foreground font-sans font-normal">
            {excerpt}
          </p>

          {/* Tags Row */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags?tag=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-secondary/70 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Read Article Action Button */}
        <Link
          href={`/post/${slug}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent md:mt-1 shrink-0 shadow-xs"
          aria-label={`Read article: ${title}`}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  )
}
