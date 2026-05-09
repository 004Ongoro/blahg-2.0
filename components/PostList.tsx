'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PostCard } from '@/components/PostCard'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  readTime: number
  tags: string[]
  views: number
}

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return
      }

      if (e.key === 'j') {
        setSelectedIndex((prev) => (prev < posts.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'k') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === 'Enter' && selectedIndex !== -1) {
        router.push(`/post/${posts[selectedIndex].slug}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [posts, selectedIndex, router])

  // Scroll into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex !== -1) {
      const element = document.getElementById(`post-${posts[selectedIndex]._id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selectedIndex, posts])

  if (posts.length === 0) {
    return (
      <div className="brutal-border brutal-shadow bg-card p-8 text-center">
        <p className="text-muted-foreground text-lg mb-2">no posts yet.</p>
        <p className="text-sm text-muted-foreground">
          check back later or head to{' '}
          <a href="/admin" className="text-accent hover:underline">/admin</a>{' '}
          to create your first post.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden md:flex items-center gap-4 mb-2 text-[10px] font-black uppercase text-muted-foreground/60">
        <span className="flex items-center gap-1.5">
          NAV: <kbd className="brutal-border-sm px-1 bg-background text-foreground">j</kbd> / <kbd className="brutal-border-sm px-1 bg-background text-foreground">k</kbd> 
        </span>
        <span className="text-accent">|</span>
        <span className="flex items-center gap-1.5">
          OPEN: <kbd className="brutal-border-sm px-1 bg-background text-foreground">enter</kbd>
        </span>
        <span className="text-accent">|</span>
        <span className="flex items-center gap-1.5 text-accent">
          PALETTE: <kbd className="brutal-border-sm px-1 bg-background text-foreground">⌘</kbd> + <kbd className="brutal-border-sm px-1 bg-background text-foreground">k</kbd>
        </span>
      </div>
      {posts.map((post, index) => (
        <div key={post._id} id={`post-${post._id}`}>
          <PostCard
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            createdAt={new Date(post.createdAt)}
            readTime={post.readTime}
            tags={post.tags}
            views={post.views}
            isSelected={index === selectedIndex}
          />
        </div>
      ))}
    </div>
  )
}
