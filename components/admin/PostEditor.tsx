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
          <div className="bg-background/80 backdrop-blur-sm border border-foreground/5 rounded-[2rem] p-8 shadow-2xl space-y-6 will-change-transform">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Metadata_Config</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Identity</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Record Title"
                  className="w-full bg-background/50 border border-foreground/5 rounded-2xl h-12 px-4 text-sm focus:ring-accent focus:border-accent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Slug_Handle</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/5 rounded-2xl h-12 px-4 text-sm focus:ring-accent focus:border-accent transition-all opacity-80"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Brief_Description</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Post summary for the preview modules..."
                className="w-full bg-background/50 border border-foreground/5 rounded-2xl p-4 text-sm focus:ring-accent focus:border-accent transition-all resize-none"
                required
              />
              <div className="flex justify-end px-1">
                <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">{excerpt.length}/300 BYTES</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Tag_Array</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="comma, separated, tags"
                    className="w-full bg-background/50 border border-foreground/5 rounded-2xl h-12 pl-10 pr-4 text-sm focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Series_Link</label>
                  <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    list="series-list"
                    placeholder="Collection"
                    className="w-full bg-background/50 border border-foreground/5 rounded-2xl h-12 px-4 text-sm focus:ring-accent focus:border-accent transition-all"
                  />
                  <datalist id="series-list">
                    {allSeries.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Seq_Index</label>
                  <input
                    type="number"
                    value={seriesOrder}
                    onChange={(e) => setSeriesOrder(e.target.value)}
                    className="w-full bg-background/50 border border-foreground/5 rounded-2xl h-12 px-4 text-sm focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background/80 backdrop-blur-sm border border-foreground/5 rounded-[2rem] p-8 shadow-2xl space-y-4 will-change-transform">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Payload_Editor</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-foreground/5 rounded-full text-[8px] font-black tracking-widest text-muted-foreground">
                  <Clock size={10} />
                  ~{readTime} MIN_READ
                </div>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-background/20 border border-foreground/5 rounded-2xl p-6 text-sm focus:ring-accent focus:border-accent transition-all resize-none font-mono min-h-[500px] leading-relaxed"
              placeholder="# Start writing your transmission..."
              required
            />
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 space-y-6">
            <div className="flex items-center justify-between px-4 mb-2">
              <div className="flex items-center gap-2">
                <Monitor size={14} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">System_Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline lg:hidden"
              >
                {showPreview ? 'Close_Preview' : 'Launch_Preview'}
              </button>
            </div>

            <div
              className={cn(
                "bg-background/30 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] p-8 overflow-auto transition-all",
                showPreview ? "fixed inset-4 z-[100] bg-background lg:relative lg:inset-auto lg:h-[calc(100vh-400px)]" : "hidden lg:block lg:h-[calc(100vh-400px)]"
              )}
            >
              {content ? (
                <div
                  className="prose-brutal"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4">
                  <Eye size={48} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No data to render</p>
                </div>
              )}
            </div>

            {/* Admin Quick Info Pill */}
            <div className="bg-foreground/5 border border-foreground/5 rounded-3xl p-6 hidden lg:block">
              <div className="flex items-center gap-4 mb-4">
                <Settings size={14} className="opacity-40" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Session_Metadata</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Status</span>
                  <span className={cn("text-[10px] font-bold uppercase", published ? "text-accent" : "text-muted-foreground")}>
                    {published ? 'Live_Public' : 'Staged_Draft'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Environment</span>
                  <span className="text-[10px] font-bold uppercase">Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-4xl px-4 will-change-transform">
        <div className="bg-background/90 backdrop-blur-sm border border-foreground/10 rounded-full p-2 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 px-6">
            <Link
              href="/admin"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-foreground/5 text-muted-foreground hover:bg-foreground hover:text-background transition-all"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="h-6 w-px bg-foreground/5" />
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-10 h-6 rounded-full p-1 transition-all",
                published ? "bg-accent" : "bg-foreground/10"
              )}>
                <div className={cn(
                  "h-4 w-4 rounded-full bg-background transition-all shadow-sm",
                  published ? "translate-x-4" : "translate-x-0"
                )} />
              </div>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="hidden"
              />
              <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-foreground transition-colors">
                Live_Switch
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pr-2">
            {error && <span className="text-destructive text-[9px] font-bold uppercase tracking-widest mr-4">{error}</span>}
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  {isEditing ? 'Commit_Changes' : 'Initialize_Record'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
