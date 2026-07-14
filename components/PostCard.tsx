'use client'

import Link from 'next/link'
import { FormattedDate } from './FormattedDate'
import { cn } from '@/lib/utils'

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  createdAt: Date
  readTime: number
  tags: string[]
  isSelected?: boolean
  series?: string
  views?: number
}

export function PostCard({
  title,
  slug,
  excerpt,
  createdAt,
  readTime,
  tags,
  isSelected = false,
  series,
  views = 0,
}: PostCardProps) {
  return (
    <article 
      className={cn(
        "brutal-border brutal-shadow p-6 transition-all duration-200 relative overflow-hidden",
        isSelected 
          ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background translate-x-1 bg-accent text-accent-foreground" 
          : "hover:-translate-y-1 bg-card"
      )}
    >
      <div className="flex justify-between items-start mb-2 gap-4">
        <div className="flex flex-wrap gap-2">
          {series && (
            <Link 
              href={`/series/${encodeURIComponent(series)}`}
              className={cn(
                "px-2 py-0.5 text-[10px] font-black uppercase brutal-border brutal-shadow flex items-center gap-1 transition-all",
                isSelected ? "bg-background text-foreground" : "bg-accent text-accent-foreground"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="shrink-0">📚</span> {series}
            </Link>
          )}
          {views > 100 && (
            <div className="bg-accent text-accent-foreground px-2 py-1 text-[10px] font-black uppercase brutal-border brutal-shadow flex items-center gap-1 animate-pulse">
              <span>🔥</span> trending
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <Link href={`/post/${slug}`} className="block group-hover:text-accent transition-colors">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
              {title}
            </h2>
          </Link>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground font-medium">
            {excerpt}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags?tag=${encodeURIComponent(tag)}`}
                className="text-[10px] font-bold uppercase tracking-wider text-accent/60 hover:text-accent transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <Link 
          href={`/post/${slug}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/5 bg-background transition-all group-hover:bg-accent group-hover:text-accent-foreground md:mt-2"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
      </div>
    </article>
  )
}
