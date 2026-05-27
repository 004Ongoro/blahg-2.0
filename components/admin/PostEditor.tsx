'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { slugify, calculateReadTime } from '@/lib/utils'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { 
  Send, 
  X, 
  Eye, 
  FileEdit, 
  Hash, 
  Layers, 
  Clock, 
  ArrowLeft,
  Loader2,
  Settings,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  published: boolean
  series?: string
  seriesOrder?: number
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
  const [series, setSeries] = useState(post?.series || '')
  const [seriesOrder, setSeriesOrder] = useState(post?.seriesOrder?.toString() || '0')
  const [allSeries, setAllSeries] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(slugify(title))
    }
  }, [title, isEditing])

  // Fetch all series for the dropdown
  useEffect(() => {
    async function fetchSeries() {
      try {
        const res = await fetch('/api/admin/series')
        if (res.ok) {
          const data = await res.json()
          setAllSeries(data)
        }
      } catch (err) {
        console.error('Failed to fetch series', err)
      }
    }
    fetchSeries()
  }, [])

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
      series: series.trim() || undefined,
      seriesOrder: parseInt(seriesOrder) || 0,
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
    <form onSubmit={handleSubmit} className="space-y-8 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="brutal-border brutal-shadow bg-card p-8 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8 italic">Metadata Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full brutal-border bg-background h-12 px-4 font-bold focus:ring-4 ring-accent outline-none border-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Slug (Handle)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full brutal-border bg-background h-12 px-4 font-bold focus:ring-4 ring-accent outline-none border-black opacity-80"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Short summary..."
                className="w-full brutal-border bg-background p-4 font-bold focus:ring-4 ring-accent outline-none border-black resize-none"
                required
              />
              <div className="flex justify-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{excerpt.length}/300 Chars</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tag1, tag2..."
                  className="w-full brutal-border bg-background h-12 px-4 font-bold focus:ring-4 ring-accent outline-none border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Series</label>
                  <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    list="series-list"
                    placeholder="None"
                    className="w-full brutal-border bg-background h-12 px-4 font-bold focus:ring-4 ring-accent outline-none border-black"
                  />
                  <datalist id="series-list">
                    {allSeries.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order</label>
                  <input
                    type="number"
                    value={seriesOrder}
                    onChange={(e) => setSeriesOrder(e.target.value)}
                    className="w-full brutal-border bg-background h-12 px-4 font-bold focus:ring-4 ring-accent outline-none border-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="brutal-border brutal-shadow bg-card p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight italic">Content (Markdown)</h2>
              <div className="bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase flex items-center gap-2">
                <Clock size={12} /> ~{readTime} Min Read
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full brutal-border bg-background p-6 font-mono text-base focus:ring-4 ring-accent outline-none border-black min-h-[600px] leading-relaxed"
              placeholder="# Start writing..."
              required
            />
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2">
                <Monitor size={20} className="text-accent" /> Live Preview
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden brutal-btn bg-accent text-accent-foreground px-4 py-1 text-xs font-black uppercase"
              >
                {showPreview ? 'Close' : 'Launch'}
              </button>
            </div>

            <div
              className={cn(
                "brutal-border bg-card p-8 overflow-auto transition-all",
                showPreview ? "fixed inset-4 z-[100] bg-background lg:relative lg:inset-auto lg:h-[calc(100vh-300px)]" : "hidden lg:block lg:h-[calc(100vh-300px)]"
              )}
            >
              {content ? (
                <div
                  className="prose-brutal"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4 py-20 border-4 border-dashed border-foreground/10">
                  <Eye size={48} />
                  <p className="text-lg font-black uppercase tracking-widest">Buffer Empty</p>
                </div>
              )}
            </div>

            <div className="bg-foreground text-background p-6 brutal-border shadow-[4px_4px_0px_0px_var(--color-accent)] hidden lg:block">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Settings size={14} className="text-accent" /> System Metadata
              </h3>
              <div className="grid grid-cols-2 gap-8 font-black uppercase text-[10px]">
                <div>
                  <span className="text-muted-foreground block mb-1">Status</span>
                  <span className={cn(published ? "text-accent" : "text-yellow-400")}>
                    {published ? 'Live Public' : 'Draft Mode'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Target</span>
                  <span>Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-5xl px-4">
        <div className="bg-background brutal-border p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="h-12 w-12 flex items-center justify-center brutal-border bg-white hover:bg-accent transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-muted brutal-border border-black peer-checked:bg-accent transition-colors" />
                <div className="absolute left-1 top-1 w-5 h-5 bg-foreground brutal-border border-black peer-checked:translate-x-7 transition-all" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Publish Live</span>
            </label>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {error && <span className="text-destructive text-[10px] font-black uppercase mr-4">{error}</span>}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none brutal-btn bg-accent text-accent-foreground px-12 py-4 font-black uppercase text-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send size={24} />
                  {isEditing ? 'Update Post' : 'Create Post'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
