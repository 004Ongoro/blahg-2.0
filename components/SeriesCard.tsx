import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Layers, CheckCircle2, Circle } from 'lucide-react'

interface SeriesPost {
  title: string
  slug: string
  seriesOrder: number
}

interface SeriesCardProps {
  currentSlug: string
  seriesName: string
  posts: SeriesPost[]
}

export function SeriesCard({ currentSlug, seriesName, posts }: SeriesCardProps) {
  const sortedPosts = [...posts].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
  const currentIndex = sortedPosts.findIndex(p => p.slug === currentSlug)
  const progress = Math.round(((currentIndex + 1) / sortedPosts.length) * 100)

  return (
    <div className="brutal-border brutal-shadow bg-card mb-8 overflow-hidden">
      <div className="bg-foreground text-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" />
          <h3 className="font-black uppercase tracking-tight text-sm md:text-base">
            Series: {seriesName}
          </h3>
        </div>
        <span className="font-black text-xs md:text-sm bg-accent text-accent-foreground px-2 py-0.5 brutal-border">
          {currentIndex + 1} / {sortedPosts.length}
        </span>
      </div>
      
      <div className="p-4 md:p-6 bg-secondary/30">
        <div className="w-full h-4 brutal-border bg-background mb-6 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-accent transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {sortedPosts.map((post, index) => {
            const isCurrent = post.slug === currentSlug
            const isCompleted = index < currentIndex

            return (
              <Link 
                key={post.slug}
                href={`/post/${post.slug}`}
                className={cn(
                  "flex items-center gap-3 p-2 transition-all font-bold text-sm border-2 border-transparent",
                  isCurrent 
                    ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0_var(--foreground)]" 
                    : "hover:bg-accent/10 hover:border-foreground/20"
                )}
              >
                <span className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-4 border-accent-foreground" />
                  ) : (
                    <Circle className="w-4 h-4 opacity-30" />
                  )}
                </span>
                <span className="line-clamp-1">
                  {index + 1}. {post.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
