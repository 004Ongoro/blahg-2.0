import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDate, cn } from '@/lib/utils'

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  createdAt: Date
  readTime: number
  tags: string[]
  series?: string
  views?: number
  isSelected?: boolean
}

export function PostCard({
  title,
  slug,
  excerpt,
  createdAt,
  readTime,
  tags,
  series,
  views = 0,
  isSelected = false,
}: PostCardProps) {
  return (
    <motion.article 
      initial={false}
      animate={{ 
        x: isSelected ? 4 : 0,
        backgroundColor: isSelected ? 'var(--accent)' : 'var(--card)',
        color: isSelected ? 'var(--accent-foreground)' : 'inherit'
      }}
      className={cn(
        "brutal-border brutal-shadow p-6 transition-all duration-200 relative overflow-hidden",
        isSelected 
          ? "border-foreground shadow-[8px_8px_0_var(--foreground)] ring-2 ring-foreground ring-offset-2 ring-offset-background" 
          : "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)]"
      )}
    >
      <div className="flex justify-between items-start mb-2 gap-4">
        <div className="flex flex-wrap gap-2">
          {series && (
            <Link 
              href={`/series/${encodeURIComponent(series)}`}
              className={cn(
                "px-2 py-0.5 text-[10px] font-black uppercase brutal-border brutal-shadow flex items-center gap-1 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--foreground)]",
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

      {isSelected && (
        <div className="absolute top-0 left-0 w-2 h-full bg-foreground" />
      )}
      <Link href={`/post/${slug}`} className="block">
        <h2 className={cn(
          "text-xl md:text-2xl font-bold mb-2 transition-colors",
          isSelected ? "text-accent-foreground" : "text-foreground hover:text-accent"
        )}>
          {title}
        </h2>
      </Link>
      <p className={cn(
        "mb-4 leading-relaxed",
        isSelected ? "text-accent-foreground/90" : "text-muted-foreground"
      )}>
        {excerpt}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className={isSelected ? "text-accent-foreground/70" : "text-muted-foreground"}>
          {formatDate(createdAt)}
        </span>
        <span className={isSelected ? "text-accent-foreground" : "text-accent"}>|</span>
        <span className={isSelected ? "text-accent-foreground/70" : "text-muted-foreground"}>
          {readTime} min read
        </span>
        {tags.length > 0 && (
          <>
            <span className={isSelected ? "text-accent-foreground" : "text-accent"}>|</span>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className={cn(
                    "px-2 py-0.5 text-xs brutal-border transition-colors",
                    isSelected 
                      ? "bg-background text-foreground hover:bg-foreground hover:text-background border-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.article>
  )
}
