'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Eye, Edit3, Trash2, Clock, Hash, Layers, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  createdAt: string
  readTime: number
  tags: string[]
  series?: string
  seriesOrder?: number
}

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  const router = useRouter()
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeletingSlug(slug)
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setDeletingSlug(null)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center opacity-40">
        <p className="text-xs font-black uppercase tracking-[0.3em] mb-4">No records found in buffer</p>
        <Link href="/admin/new" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
          Initialize first entry &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-background/50 border border-foreground/5 rounded-2xl hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
        >
          {/* Status Indicator Bar */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1 transition-all",
            post.published ? "bg-accent" : "bg-muted-foreground/20 group-hover:bg-muted-foreground/40"
          )} />

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
                post.published 
                  ? "bg-accent/10 text-accent border border-accent/20" 
                  : "bg-foreground/5 text-muted-foreground border border-foreground/5"
              )}>
                {post.published ? <CheckCircle2 size={8} /> : <Circle size={8} />}
                {post.published ? 'LIVE' : 'DRAFT'}
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight truncate group-hover:text-accent transition-colors">
                {post.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                <Clock size={12} className="opacity-40" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                <Hash size={12} className="opacity-40" />
                <span>{post.readTime} MIN_READ</span>
              </div>

              {post.series && (
                <div className="flex items-center gap-1.5 text-[10px] font-black text-accent/60 uppercase">
                  <Layers size={12} className="opacity-40" />
                  <span>{post.series} <span className="opacity-40">[{post.seriesOrder}]</span></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.published && (
              <Link
                href={`/post/${post.slug}`}
                target="_blank"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-foreground/5 text-muted-foreground hover:bg-foreground hover:text-background transition-all"
                title="View Live"
              >
                <Eye size={16} />
              </Link>
            )}
            
            <Link
              href={`/admin/edit/${post.slug}`}
              className="h-10 px-6 flex items-center gap-2 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Edit3 size={14} />
              Edit_Log
            </Link>

            <button
              onClick={() => handleDelete(post.slug)}
              disabled={deletingSlug === post.slug}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all disabled:opacity-50"
              title="Delete Record"
            >
              {deletingSlug === post.slug ? '...' : <Trash2 size={16} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
