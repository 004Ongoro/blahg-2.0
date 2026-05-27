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
        <p className="text-xs font-black uppercase tracking-[0.3em] mb-4">No records found</p>
        <Link href="/admin/new" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
          Initialize first entry &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-foreground/5">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 transition-all"
        >
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                post.published 
                  ? "bg-accent/5 text-accent border-accent/10" 
                  : "bg-foreground/5 text-muted-foreground border-foreground/10"
              )}>
                {post.published ? 'LIVE' : 'DRAFT'}
              </div>
              <h3 className="text-base font-black uppercase tracking-tight truncate leading-none group-hover:text-accent transition-colors">
                {post.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="opacity-40" />
                {formatDate(post.createdAt)}
              </span>
              
              <span className="flex items-center gap-1.5">
                <Hash size={12} className="opacity-40" />
                {post.readTime} MIN
              </span>

              {post.series && (
                <span className="flex items-center gap-1.5 text-accent/60">
                  <Layers size={12} className="opacity-40" />
                  {post.series} [{post.seriesOrder}]
                </span>
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
              className="h-10 px-6 flex items-center gap-2 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <Edit3 size={14} />
              Edit
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
