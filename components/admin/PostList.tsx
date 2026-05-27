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
      <div className="py-20 text-center brutal-border border-dashed bg-muted/30">
        <p className="text-xl font-black uppercase tracking-widest mb-4">No records found</p>
        <Link href="/admin/new" className="text-accent font-black uppercase underline hover:no-underline">
          Initialize first entry &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 brutal-border bg-background transition-all hover:bg-muted/10"
        >
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "px-3 py-1 brutal-border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                post.published 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              )}>
                {post.published ? 'Live' : 'Draft'}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight truncate leading-none">
                {post.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-muted-foreground uppercase">
              <span className="flex items-center gap-2">
                <Clock size={14} />
                {formatDate(post.createdAt)}
              </span>
              
              <span className="flex items-center gap-2">
                <Hash size={14} />
                {post.readTime} Min
              </span>

              {post.series && (
                <span className="flex items-center gap-2 text-accent">
                  <Layers size={14} />
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
                className="h-12 w-12 flex items-center justify-center brutal-border bg-white hover:bg-accent hover:text-accent-foreground transition-all"
                title="View Live"
              >
                <Eye size={20} />
              </Link>
            )}
            
            <Link
              href={`/admin/edit/${post.slug}`}
              className="h-12 px-6 flex items-center gap-2 brutal-border bg-white font-black uppercase text-sm hover:bg-foreground hover:text-background transition-all"
            >
              <Edit3 size={18} />
              Edit
            </Link>

            <button
              onClick={() => handleDelete(post.slug)}
              disabled={deletingSlug === post.slug}
              className="h-12 w-12 flex items-center justify-center brutal-border bg-destructive text-destructive-foreground hover:bg-red-700 transition-all disabled:opacity-50"
              title="Delete Record"
            >
              {deletingSlug === post.slug ? '...' : <Trash2 size={20} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
