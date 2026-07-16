'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PlusCircle, Trash2, Clock, ShieldAlert, Sparkles, Activity as ActivityIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItem {
  _id: string
  content: string
  category: 'working' | 'learning' | 'reading' | 'listening' | 'playing' | 'general'
  emoji: string
  createdAt: string
}

const emojiPresets = ['📍', '💻', '📚', '🎧', '🎮', '🧠', '🚀', '💡', '🌱', '🍿', '✍️', '🚲']

export default function AdminNowPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<'working' | 'learning' | 'reading' | 'listening' | 'playing' | 'general'>('general')
  const [emoji, setEmoji] = useState('📍')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/now')
      if (!res.ok) throw new Error('Failed to fetch timeline logs')
      const data = await res.json()
      setActivities(data)
    } catch (err: any) {
      console.error(err)
      setError('Could not retrieve timeline log archive.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!content) {
      setError('Please enter status details.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category, emoji }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Timeline status updated!')
        setContent('')
        setCategory('general')
        setEmoji('📍')
        fetchActivities()
      } else {
        setError(data.error || 'Failed to save timeline entry')
      }
    } catch (err) {
      setError('Network communication failure.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this status entry from the logs?')) return

    try {
      const res = await fetch(`/api/now?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setActivities((prev) => prev.filter((item) => item._id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete status entry')
      }
    } catch (err) {
      alert('Network failure deleting status entry')
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
                Timeline_Controller
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Manage <span className="text-accent italic">Now Feed</span>
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
              Log New Activity
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Content text */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Status details *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What are you doing right now? (e.g. coding a new portfolio dashboard, reading 'Building a Second Brain'...)"
                  required
                  rows={4}
                  className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none font-mono"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono text-foreground"
                >
                  <option value="general">General / Status</option>
                  <option value="working">Working</option>
                  <option value="learning">Learning</option>
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                  <option value="playing">Playing</option>
                </select>
              </div>

              {/* Emoji Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Emoji Indicator
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="📍"
                    className="w-12 text-center bg-foreground/[0.03] border border-foreground/5 rounded-2xl py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono"
                  />
                  <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                    {emojiPresets.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEmoji(p)}
                        className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-lg border text-sm transition-all hover:scale-110",
                          emoji === p ? "border-accent bg-accent/10" : "border-foreground/5 bg-foreground/[0.02]"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs flex items-start gap-2.5 font-bold uppercase tracking-wider">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs flex items-start gap-2.5 font-bold uppercase tracking-wider">
                  <Sparkles size={16} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-foreground text-background font-black uppercase text-xs tracking-widest rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Transmitting...' : 'Log Activity'}
              </button>
            </form>
          </section>

          {/* Right Column: List & Stats */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <ActivityIcon size={14} className="text-accent" />
                Logged timeline feed ({activities.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xs text-muted-foreground font-black uppercase animate-pulse">
                Querying database clusters...
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-20 border border-foreground/5 rounded-3xl bg-background/50">
                <Clock size={24} className="mx-auto text-muted-foreground/30 mb-3" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Timeline Empty
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((item, idx) => (
                  <div 
                    key={item._id}
                    className="p-5 border border-foreground/5 rounded-2xl hover:border-foreground/15 transition-all bg-card/50 flex gap-4 items-start"
                  >
                    <span className="text-xl bg-foreground/[0.03] border border-foreground/5 p-2 rounded-xl shrink-0 leading-none">
                      {item.emoji}
                    </span>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-foreground/5 text-muted-foreground">
                          {item.category}
                        </span>
                        {idx === 0 && (
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                            Latest
                          </span>
                        )}
                        <span className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest ml-auto">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-foreground/80 leading-relaxed break-words font-medium whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 border border-destructive/10 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all self-center cursor-pointer shrink-0"
                      title="Delete activity log"
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
