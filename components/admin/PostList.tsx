'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  createdAt: string
  readTime: number
  tags: string[]
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
      <div className="brutal-border brutal-shadow bg-card p-8 text-center">
        <p className="text-muted-foreground mb-2">no posts yet.</p>
        <Link href="/admin/new" className="text-accent hover:underline">
          create your first post &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="brutal-border brutal-shadow bg-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold truncate">{post.title}</h3>
              <span
                className={`text-xs px-2 py-0.5 brutal-border ${
                  post.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {post.published ? 'published' : 'draft'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(post.createdAt)}</span>
              <span>|</span>
              <span>{post.readTime} min read</span>
              {post.tags.length > 0 && (
                <>
                  <span>|</span>
                  <span>{post.tags.join(', ')}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.published && (
              <Link
                href={`/post/${post.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                view
              </Link>
            )}
            <Link
              href={`/admin/edit/${post.slug}`}
              className="brutal-btn bg-secondary text-secondary-foreground px-3 py-1 text-sm font-bold"
            >
              edit
            </Link>
            <button
              onClick={() => handleDelete(post.slug)}
              disabled={deletingSlug === post.slug}
              className="brutal-btn bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold disabled:opacity-50"
            >
              {deletingSlug === post.slug ? '...' : 'delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
