'use client'

import Link from 'next/link'
import { FormattedDate } from './FormattedDate'

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
    <article className="group relative border-b border-foreground/5 py-8 first:pt-0 last:border-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <FormattedDate date={createdAt} />
            <span className="h-1 w-1 rounded-full bg-accent/30" />
            <span>{readTime} min read</span>
          </div>

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
                href={`/tags/${tag}`}
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
