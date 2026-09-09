'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { slugify, calculateReadTime, cn } from '@/lib/utils'
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
import { useAutoSaveDraft } from '@/hooks/useAutoSaveDraft'
import { DraftSyncBadge } from '@/components/admin/DraftSyncBadge'
import { useCallback } from 'react'

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
  authorName?: string
  authorBio?: string
  authorEmail?: string
  isGuest?: boolean
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
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(', ') || '')
  const [published, setPublished] = useState(post?.published || false)
  const [series, setSeries] = useState(post?.series || '')
  const [seriesOrder, setSeriesOrder] = useState(post?.seriesOrder?.toString() || '0')
  const [authorName, setAuthorName] = useState(post?.authorName || '')
  const [authorBio, setAuthorBio] = useState(post?.authorBio || '')
  const [authorEmail, setAuthorEmail] = useState(post?.authorEmail || '')
  const [isGuest, setIsGuest] = useState(post?.isGuest || false)
  const [allSeries, setAllSeries] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const draftKey = isEditing ? `draft_admin_post_${post._id}` : 'draft_admin_post_new'

  const formData = useMemo(
    () => ({
      title,
      slug,
      content,
      excerpt,
      tagsInput,
      published,
      series,
      seriesOrder,
      authorName,
      authorBio,
      authorEmail,
      isGuest,
    }),
    [
      title,
      slug,
      content,
      excerpt,
      tagsInput,
      published,
      series,
      seriesOrder,
      authorName,
      authorBio,
      authorEmail,
      isGuest,
    ]
  )

  const handleRestore = useCallback((restored: typeof formData) => {
    if (restored.title !== undefined) setTitle(restored.title)
    if (restored.slug !== undefined) setSlug(restored.slug)
    if (restored.content !== undefined) setContent(restored.content)
    if (restored.excerpt !== undefined) setExcerpt(restored.excerpt)
    if (restored.tagsInput !== undefined) setTagsInput(restored.tagsInput)
    if (restored.published !== undefined) setPublished(restored.published)
    if (restored.series !== undefined) setSeries(restored.series)
    if (restored.seriesOrder !== undefined) setSeriesOrder(restored.seriesOrder)
    if (restored.authorName !== undefined) setAuthorName(restored.authorName)
    if (restored.authorBio !== undefined) setAuthorBio(restored.authorBio)
    if (restored.authorEmail !== undefined) setAuthorEmail(restored.authorEmail)
    if (restored.isGuest !== undefined) setIsGuest(restored.isGuest)
  }, [])

  const handleSyncToDb = useCallback(
    async (
      data: typeof formData,
      currentDraftId: string | null,
      currentDraftSlug: string | null
    ) => {
      const tags = data.tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

      const payload = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        tags,
        published: false,
        isDraft: true,
        series: data.series.trim() || undefined,
        seriesOrder: parseInt(data.seriesOrder) || 0,
        authorName: data.authorName.trim() || undefined,
        authorBio: data.authorBio.trim() || undefined,
        authorEmail: data.authorEmail.trim() || undefined,
        isGuest: data.isGuest,
        draftSlug: currentDraftSlug || (isEditing ? post.slug : undefined),
      }

      if (isEditing) {
        const res = await fetch(`/api/posts/${post.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const resData = await res.json()
        return { draftSlug: resData.slug, draftId: resData._id }
      } else {
        const targetSlug = currentDraftSlug || (data.slug.trim() ? data.slug : undefined)
        const url = targetSlug ? `/api/posts/${targetSlug}` : '/api/posts'
        const method = targetSlug ? 'PUT' : 'POST'

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const resData = await res.json()
        return { draftSlug: resData.slug, draftId: resData._id }
      }
    },
    [isEditing, post]
  )

  const hasContent = useCallback(
    (data: typeof formData) => !!(data.title.trim() || data.content.trim()),
    []
  )

  const { syncStatus, lastSyncedTime, clearDraft, triggerSync } = useAutoSaveDraft({
    key: draftKey,
    data: formData,
    onRestore: handleRestore,
    onSyncToDb: handleSyncToDb,
    hasContent,
  })

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

    const { draftSlug: activeDraftSlug } = clearDraft()

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
      isDraft: false,
      draftSlug: activeDraftSlug || slug,
      series: series.trim() || undefined,
      seriesOrder: parseInt(seriesOrder) || 0,
      authorName: authorName.trim() || undefined,
      authorBio: authorBio.trim() || undefined,
      authorEmail: authorEmail.trim() || undefined,
      isGuest,
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
    <form onSubmit={handleSubmit} className="space-y-12 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
        
        {/* Editor Side */}
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">1. Metadata</h2>
              <DraftSyncBadge status={syncStatus} lastSyncedTime={lastSyncedTime} onManualSync={triggerSync} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">identity</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Transmission Title"
                  className="w-full bg-background border-b-2 border-foreground/10 py-2 text-xl font-black uppercase tracking-tight focus:outline-none focus:border-accent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">slug_handle</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-background border-b-2 border-foreground/10 py-2 text-sm font-bold text-muted-foreground focus:outline-none focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">brief_description</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Short summary..."
                className="w-full bg-background border-b-2 border-foreground/10 py-2 text-base font-medium focus:outline-none focus:border-accent transition-all resize-none"
                required
              />
              <div className="flex justify-end">
                <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">{excerpt.length}/300 chars</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">tag_array</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="comma, separated, tags"
                  className="w-full bg-background border-b-2 border-foreground/10 py-2 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">series_link</label>
                  <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    list="series-list"
                    placeholder="None"
                    className="w-full bg-background border-b-2 border-foreground/10 py-2 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                  />
                  <datalist id="series-list">
                    {allSeries.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">seq_index</label>
                  <input
                    type="number"
                    value={seriesOrder}
                    onChange={(e) => setSeriesOrder(e.target.value)}
                    className="w-full bg-background border-b-2 border-foreground/10 py-2 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Guest Author Section */}
            <div className="border border-foreground/10 rounded-2xl p-6 bg-foreground/[0.01] space-y-6 mt-8">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isGuest"
                  checked={isGuest}
                  onChange={(e) => setIsGuest(e.target.checked)}
                  className="rounded border-foreground/20 text-accent focus:ring-accent"
                />
                <label htmlFor="isGuest" className="text-xs font-black uppercase tracking-widest cursor-pointer select-none">
                  Guest Author Transmission
                </label>
              </div>

              {isGuest && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Guest Author Name</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-background border-b-2 border-foreground/10 py-1.5 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Guest Author Bio / Link</label>
                      <input
                        type="text"
                        value={authorBio}
                        onChange={(e) => setAuthorBio(e.target.value)}
                        placeholder="e.g. Developer & Writer"
                        className="w-full bg-background border-b-2 border-foreground/10 py-1.5 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Guest Contact Email</label>
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="e.g. user@domain.com"
                      className="w-full bg-background border-b-2 border-foreground/10 py-1.5 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">2. Payload</h2>
              <div className="text-[8px] font-black uppercase bg-foreground/5 px-2 py-0.5 rounded tracking-widest text-muted-foreground">
                ESTIMATED_READ: {readTime} MIN
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-background border border-foreground/5 rounded-2xl p-8 font-mono text-base focus:outline-none focus:ring-1 ring-accent transition-all resize-none min-h-[600px] leading-relaxed"
              placeholder="# Start writing transmission..."
              required
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">3. System Preview</h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                {showPreview ? 'hide_preview' : 'show_preview'}
              </button>
            </div>

            {showPreview && (
              <div className="border border-foreground/5 rounded-2xl p-8 bg-foreground/[0.01] animate-in fade-in slide-in-from-top-2">
                {content ? (
                  <div
                    className="prose-brutal"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p className="text-center py-20 text-[10px] font-black uppercase tracking-widest opacity-20">no data to render</p>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4">
        <div className="bg-background border border-foreground/10 rounded-full p-2 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 pl-4">
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="h-6 w-px bg-foreground/5" />
            <label className="flex items-center gap-3 cursor-pointer group">
               <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className={cn(
                "w-8 h-4 rounded-full p-0.5 transition-all",
                published ? "bg-accent" : "bg-foreground/10"
              )}>
                <div className={cn(
                  "h-3 w-3 rounded-full bg-background transition-all shadow-sm",
                  published ? "translate-x-4" : "translate-x-0"
                )} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-foreground transition-colors">
                Publish
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {error && <span className="text-destructive text-[8px] font-bold uppercase tracking-widest mr-2">{error}</span>}
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-6 bg-foreground text-background rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  <Send size={12} />
                  {isEditing ? 'Update_Log' : 'Create_Log'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
