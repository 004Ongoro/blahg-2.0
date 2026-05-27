'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PostCard } from './PostCard'
import { cn } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  readTime: number
  tags: string[]
}

interface TagLibraryProps {
  posts: Post[]
}

function TagLibraryContent({ posts }: TagLibraryProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedTag = searchParams.get('tag')

  // Calculate tag counts and alphabetical groups
  const tagGroups = useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })

    const sortedTags = Object.keys(counts).sort((a, b) => a.localeCompare(b))
    
    const groups: Record<string, { name: string; count: number }[]> = {}
    sortedTags.forEach(tag => {
      const char = tag[0].toUpperCase()
      if (!groups[char]) groups[char] = []
      groups[char].push({ name: tag, count: counts[tag] })
    })

    return groups
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter(post => post.tags?.includes(selectedTag))
  }, [posts, selectedTag])

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      router.push('/tags', { scroll: false })
    } else {
      router.push(`/tags?tag=${encodeURIComponent(tag)}`, { scroll: false })
    }
  }

  const alphabet = Object.keys(tagGroups).sort()

  return (
    <div className="space-y-20">
      {/* The Library Index */}
      <section className="space-y-12">
        {alphabet.map(char => (
          <div key={char} className="group flex gap-8 md:gap-16">
            <div className="text-4xl md:text-6xl font-black text-foreground/5 select-none w-8 md:w-16 shrink-0 transition-colors group-hover:text-accent/20">
              {char}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-6 pt-2 md:pt-4">
              {tagGroups[char].map(tag => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={cn(
                    "flex items-baseline gap-2 transition-all group/tag",
                    selectedTag === tag.name 
                      ? "text-accent scale-105" 
                      : "text-muted-foreground/60 hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "text-lg font-bold uppercase tracking-tighter",
                    selectedTag === tag.name && "underline decoration-2 underline-offset-4"
                  )}>
                    #{tag.name}
                  </span>
                  <span className="font-mono text-[10px] opacity-40 tabular-nums font-bold">
                    {tag.count.toString().padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* The Feed */}
      <section className="space-y-12 border-t border-foreground/5 pt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            {selectedTag ? `Filtered by #${selectedTag}` : 'All Library Items'}
            <span className="ml-2 tabular-nums">({filteredPosts.length})</span>
          </h2>
          {selectedTag && (
            <button 
              onClick={() => router.push('/tags', { scroll: false })}
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex flex-col">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              createdAt={new Date(post.createdAt)}
              readTime={post.readTime}
              tags={post.tags}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export function TagLibrary(props: TagLibraryProps) {
  return (
    <Suspense fallback={<div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing Library...</div>}>
      <TagLibraryContent {...props} />
    </Suspense>
  )
}
