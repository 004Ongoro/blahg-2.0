'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { slugify, calculateReadTime } from '@/lib/utils'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  published: boolean
}

interface PostEditorProps {
  post?: Post
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [tagsInput, setTagsInput] = useState(post?.tags.join(', ') || '')
  const [published, setPublished] = useState(post?.published || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(slugify(title))
    }
  }, [title, isEditing])

  const readTime = calculateReadTime(content)

  const previewHtml = useMemo(() => {
    if (!content) return ''
    try {
      const result = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(content)
      return String(result)
    } catch {
      return '<p>Error rendering preview</p>'
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    const body = {
      title,
      slug,
      content,
      excerpt,
      tags,
      published,
    }

    try {
      const url = isEditing ? `/api/posts/${post.slug}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Failed to save post')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              slug
              <span className="text-muted-foreground font-normal ml-2">
                (auto-generated)
              </span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={300}
              className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {excerpt.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              tags
              <span className="text-muted-foreground font-normal ml-2">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="javascript, react, tutorial"
              className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold">content (markdown)</label>
              <span className="text-xs text-muted-foreground">
                ~{readTime} min read
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
              required
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold">preview</label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-accent hover:underline lg:hidden"
            >
              {showPreview ? 'hide' : 'show'}
            </button>
          </div>
          <div
            className={`brutal-border bg-card p-6 flex-1 overflow-auto ${
              showPreview ? '' : 'hidden lg:block'
            }`}
            style={{ minHeight: '400px', maxHeight: '600px' }}
          >
            {content ? (
              <div
                className="prose-brutal"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <p className="text-muted-foreground text-center mt-8">
                start typing to see preview...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t-3 brutal-border border-x-0 border-b-0">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 accent-accent"
          />
          <span className="font-bold">publish immediately</span>
        </label>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground"
          >
            cancel
          </Link>
          {error && <span className="text-destructive text-sm">{error}</span>}
          <button
            type="submit"
            disabled={loading}
            className="brutal-btn bg-accent text-accent-foreground px-6 py-2 font-bold disabled:opacity-50"
          >
            {loading
              ? 'saving...'
              : isEditing
              ? 'update post'
              : 'create post'}
          </button>
        </div>
      </div>
    </form>
  )
}
