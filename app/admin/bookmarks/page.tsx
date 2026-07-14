'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PlusCircle, Trash2, ExternalLink, Bookmark, ShieldAlert, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkItem {
  _id: string
  title: string
  url: string
  description: string
  category: 'tools' | 'libraries' | 'reads' | 'design' | 'inspiration' | 'other'
  tags: string[]
  createdAt: string
}

export default function AdminBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'tools' | 'libraries' | 'reads' | 'design' | 'inspiration' | 'other'>('tools')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks')
      if (!res.ok) throw new Error('Failed to fetch bookmarks')
      const data = await res.json()
      setBookmarks(data)
    } catch (err: any) {
      console.error(err)
      setError('Could not retrieve bookmarks archive.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!title || !url || !description) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, description, category, tags }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Bookmark successfully cataloged!')
        setTitle('')
        setUrl('')
        setDescription('')
        setTagsInput('')
        setCategory('tools')
        fetchBookmarks()
      } else {
        setError(data.error || 'Failed to save bookmark')
      }
    } catch (err) {
      setError('Network communication failure.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark from the logs?')) return

    try {
      const res = await fetch(`/api/bookmarks?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setBookmarks((prev) => prev.filter((item) => item._id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete bookmark')
      }
    } catch (err) {
      alert('Network failure deleting bookmark')
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono flex flex-col">
      <AdminHeader />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-foreground">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded mb-4 inline-block">
                Archive_Controller
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Manage <span className="text-accent italic">Bookmarks</span>
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Create Form */}
          <section className="lg:col-span-5 p-6 border border-foreground/5 bg-background rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <PlusCircle size={14} className="text-accent" />
              Log New Bookmark
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NextJS Documentation"
                  required
                  className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://nextjs.org/docs"
                  required
                  className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Quick description explaining why this tool/library/article is useful..."
                  required
                  rows={3}
                  className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono text-foreground"
                  >
                    <option value="tools">Tools</option>
                    <option value="libraries">Libraries</option>
                    <option value="reads">Reads</option>
                    <option value="design">Design</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="react, frontend, docs"
                    className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono"
                  />
                </div>
              </div>

              {error && (
                <div className="text-[11px] font-bold text-destructive flex items-center gap-1.5 bg-destructive/10 p-3 rounded-2xl border border-destructive/20 mt-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mt-2">
                  <Sparkles size={14} className="shrink-0 animate-pulse" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-foreground text-background hover:bg-foreground/90 transition-all font-black uppercase text-xs tracking-widest rounded-full disabled:opacity-50 active:scale-95 duration-100 flex items-center justify-center cursor-pointer mt-2"
              >
                {submitting ? 'Transmitting...' : 'Index Bookmark'}
              </button>
            </form>
          </section>

          {/* Right Column: Listing Table */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Bookmark size={14} className="text-accent" />
                Indexed Bookmarks
              </h2>
              <span className="text-[9px] font-black uppercase bg-foreground/5 px-2 py-0.5 rounded">
                {bookmarks.length} RECORDS
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-foreground/[0.03] border border-foreground/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <p className="text-sm font-black uppercase tracking-widest">No bookmark records found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark._id}
                    className="p-4 border border-foreground/5 bg-background rounded-2xl flex items-center justify-between gap-4 group hover:border-foreground/10 transition-colors"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase bg-foreground/5 px-1.5 py-0.5 rounded text-muted-foreground">
                          {bookmark.category}
                        </span>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-muted-foreground/60 hover:text-accent flex items-center gap-1 font-mono truncate"
                        >
                          {new URL(bookmark.url).hostname.replace('www.', '')}
                          <ExternalLink size={8} />
                        </a>
                      </div>
                      <h3 className="text-xs font-black uppercase truncate text-foreground">{bookmark.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDelete(bookmark._id)}
                      className="h-8 w-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer shrink-0"
                      title="Delete Bookmark"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
