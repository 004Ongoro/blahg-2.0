import Link from 'next/link'
import { formatDate } from '@/lib/utils'

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
    <article className="brutal-border brutal-shadow bg-card p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)] transition-all">
      <Link href={`/post/${slug}`} className="block">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-foreground hover:text-accent transition-colors">
          {title}
        </h2>
      </Link>
      <p className="text-muted-foreground mb-4 leading-relaxed">{excerpt}</p>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">
          {formatDate(createdAt)}
        </span>
        <span className="text-accent">|</span>
        <span className="text-muted-foreground">{readTime} min read</span>
        {tags.length > 0 && (
          <>
            <span className="text-accent">|</span>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="bg-secondary text-secondary-foreground px-2 py-0.5 text-xs brutal-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  )
}
