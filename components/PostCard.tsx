'use client'

import Link from 'next/link'
import { FormattedDate } from './FormattedDate'
import { ArrowUpRight, BookOpen, Clock, Tag, User } from 'lucide-react'

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  createdAt: Date
  readTime: number
  tags: string[]
  series?: string
  authorName?: string
  isGuest?: boolean
  coverImage?: string
}

export function PostCard({
  title,
  slug,
  excerpt,
  createdAt,
  readTime,
  tags,
  series,
  authorName,
  isGuest,
  coverImage,
}: PostCardProps) {
  return (
    <article className="group relative overflow-hidden border border-border bg-card/70 backdrop-blur-xs p-6 md:p-8 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 mb-6">
      {/* Ambient Top Hover Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent/0 group-hover:bg-accent transition-all duration-300" />

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        
        {/* Optional Cover Image Thumbnail */}
        {coverImage && (
          <Link href={`/post/${slug}`} className="shrink-0 w-full md:w-44 aspect-video md:aspect-4/3 rounded-xl overflow-hidden border border-border bg-muted/30 group/img">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        )}

        <div className="flex-1 space-y-3.5">
          {/* Metadata Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            {series && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px]">
                <BookOpen size={12} />
                <span>{series}</span>
              </span>
            )}

            {isGuest && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px]">
                <User size={11} />
                <span>{authorName || 'Guest Log'}</span>
              </span>
            )}

            <div className="flex items-center gap-2">
              <FormattedDate date={createdAt} />
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              <span className="flex items-center gap-1">
                <Clock size={12} className="opacity-70" />
                <span>{readTime} min read</span>
              </span>
            </div>
          </div>

          {/* Article Title */}
          <Link
            href={`/post/${slug}`}
            className="block group-hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <h2 className="text-xl md:text-2xl font-sans font-extrabold text-foreground tracking-tight leading-snug">
              {title}
            </h2>
          </Link>

          {/* Article Excerpt */}
          <p className="line-clamp-2 text-sm md:text-[15px] leading-relaxed text-muted-foreground font-sans font-normal">
            {excerpt}
          </p>

          {/* Tags Chips Row */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1.5">
              {tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg bg-secondary/70 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  <Tag size={10} className="opacity-60" />
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Read Article Action Button */}
        <Link
          href={`/post/${slug}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent md:mt-1 shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Read article: ${title}`}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  )
}
