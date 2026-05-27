'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { 
  Trash2, 
  Eye, 
  Send, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Mail, 
  CheckSquare, 
  Square,
  Search,
  ArrowLeft,
  Activity,
  Zap,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AdminNewsletter() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isMarkdown, setIsMarkdown] = useState(true)
  const [publishToArchive, setPublishToArchive] = useState(true)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({ type: '', msg: '' })
  
  // Archive state
  const [issues, setIssues] = useState<any[]>([])
  const [showPreviewMobile, setShowPreviewMobile] = useState(false)

  // Subscribers state
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch existing issues and subscribers
  const fetchData = async () => {
    try {
      const [issuesRes, subsRes] = await Promise.all([
        fetch('/api/admin/newsletter'),
        fetch('/api/admin/subscribers?limit=1000')
      ])
      
      if (issuesRes.ok) {
        const data = await issuesRes.json()
        setIssues(data)
      }
      
      if (subsRes.ok) {
        const data = await subsRes.json()
        const activeSubs = (data.subscribers || []).filter((s: any) => s.active)
        setSubscribers(activeSubs)
        // Default to all selected
        setSelectedSubscribers(activeSubs.map((s: any) => s.email))
      }
    } catch (err) {
      console.error("Failed to load data", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(subscribers.map(s => s.email))
    }
  }

  const toggleSubscriber = (email: string) => {
    if (selectedSubscribers.includes(email)) {
      setSelectedSubscribers(selectedSubscribers.filter(e => e !== email))
    } else {
      setSelectedSubscribers([...selectedSubscribers, email])
    }
  }

  const filteredSubscribers = useMemo(() => {
    if (!searchQuery) return subscribers
    return subscribers.filter(s => s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [subscribers, searchQuery])

  const previewHtml = useMemo(() => {
    if (!content) return ''
    if (!isMarkdown) return `<div style="white-space: pre-wrap;">${content}</div>`
    try {
      return unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(content)
        .toString()
    } catch {
      return 'Error rendering preview'
    }
  }, [content, isMarkdown])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSubscribers.length === 0) {
      setStatus({ type: 'error', msg: 'Select at least one recipient' })
      return
    }
    setSending(true)
    setStatus({ type: '', msg: '' })

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject, 
          content, 
          isMarkdown, 
          publishToArchive,
          recipients: selectedSubscribers
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', msg: `Broadcast sent to ${selectedSubscribers.length} recipients!` })
        setSubject('')
        setContent('')
        fetchData() // Refresh list
      } else {
        setStatus({ type: 'error', msg: data.error })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Failed to connect to server' })
    } finally {
      setSending(false)
    }
  }

  const deleteIssue = async (id: string) => {
    if (!confirm('Permanently remove this issue?')) return
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setIssues(issues.filter(i => i._id !== id))
      }
    } catch (err) {
      alert("Delete failed")
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <AdminHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-black uppercase mb-4 inline-block brutal-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Dispatch Studio
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                Broad<span className="text-accent italic">cast</span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/admin/newsletter/events"
                className="h-12 px-6 flex items-center gap-2 brutal-border bg-card font-black uppercase text-xs hover:bg-accent transition-all"
              >
                <Activity size={16} /> View Events
              </Link>
              <Link 
                href="/admin/newsletter/subscribers"
                className="h-12 px-6 flex items-center gap-2 brutal-border bg-card font-black uppercase text-xs hover:bg-accent transition-all"
              >
                <Users size={16} /> Manage Audience
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Composer Panel */}
          <div className={cn("lg:col-span-7 space-y-6", showPreviewMobile && "hidden lg:block")}>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="brutal-border brutal-shadow bg-card p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Subject Line</label>
                  <input 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    className="w-full brutal-border bg-background h-12 px-4 font-bold text-lg focus:ring-4 ring-accent outline-none border-black"
                    placeholder="Enter subject..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message Body</label>
                    <button 
                      type="button" 
                      onClick={() => setIsMarkdown(!isMarkdown)}
                      className="text-[10px] font-black uppercase brutal-border px-3 py-1 bg-white hover:bg-accent transition-all"
                    >
                      {isMarkdown ? 'MARKDOWN' : 'PLAIN TEXT'}
                    </button>
                  </div>
                  <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    className="w-full brutal-border bg-background p-6 font-mono text-sm focus:ring-4 ring-accent outline-none border-black resize-none leading-relaxed"
                    placeholder="Compose message..."
                    required
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={publishToArchive}
                      onChange={e => setPublishToArchive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-muted brutal-border border-black peer-checked:bg-accent transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-foreground brutal-border border-black peer-checked:translate-x-5 transition-all" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Public Archive Mirror</span>
                </label>
              </div>

              {/* Recipient Selection */}
              <div className="brutal-border brutal-shadow bg-card p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase italic flex items-center gap-2">
                    <Users size={20} className="text-accent" /> Recipient Selector
                  </h2>
                  <button 
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[10px] font-black uppercase underline hover:text-accent"
                  >
                    {selectedSubscribers.length === subscribers.length ? 'Clear Selection' : 'Select All Active'}
                  </button>
                </div>

                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter audience by email..."
                    className="w-full brutal-border bg-background h-12 pl-12 pr-4 font-bold text-sm focus:ring-4 ring-accent outline-none border-black"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSubscribers.length === 0 ? (
                    <div className="col-span-full py-10 text-center opacity-40">
                      <p className="text-xs font-black uppercase tracking-widest">No matching records</p>
                    </div>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <button
                        key={sub._id}
                        type="button"
                        onClick={() => toggleSubscriber(sub.email)}
                        className={cn(
                          "flex items-center gap-3 p-3 brutal-border transition-all text-left",
                          selectedSubscribers.includes(sub.email) 
                            ? "bg-accent/20 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                            : "bg-background border-black/10 hover:border-black"
                        )}
                      >
                        {selectedSubscribers.includes(sub.email) 
                          ? <CheckSquare size={16} className="text-accent" /> 
                          : <Square size={16} className="opacity-20" />
                        }
                        <span className="text-xs font-bold truncate tracking-tight">{sub.email}</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="pt-6 border-t-2 border-foreground/10 flex items-center justify-between opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Selected: {selectedSubscribers.length} / {subscribers.length} Nodes
                  </span>
                </div>
              </div>

              <button 
                disabled={sending}
                className="w-full brutal-btn py-5 bg-accent text-accent-foreground font-black uppercase text-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Send size={24} /> 
                    Blast Dispatch
                  </>
                )}
              </button>

              {status.msg && (
                <div className={cn(
                  "p-4 brutal-border flex items-center gap-3 text-sm font-black uppercase tracking-widest",
                  status.type === 'success' ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
                )}>
                  {status.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
                  {status.msg}
                </div>
              )}
            </form>
          </div>

          {/* Preview Panel */}
          <div className={cn("lg:col-span-5 space-y-4", !showPreviewMobile && "hidden lg:block")}>
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase italic flex items-center gap-2">
                <Eye size={20} className="text-accent" /> Preview
              </h2>
              <button 
                onClick={() => setShowPreviewMobile(false)}
                className="lg:hidden brutal-btn bg-accent text-accent-foreground px-4 py-1 text-xs font-black uppercase"
              >
                Back to Edit
              </button>
            </div>

            <div className="brutal-border brutal-shadow bg-white p-0 overflow-hidden min-h-[600px] flex flex-col text-black">
              <div className="p-8 bg-accent border-b-4 border-black">
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight m-0">
                  {subject || 'SUBJECT PREVIEW'}
                </h1>
              </div>

              <div className="p-8 flex-1">
                <div 
                  className="prose prose-neutral max-w-none text-base leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400 italic">Body content will appear here...</p>' }} 
                />
              </div>

              <div className="p-6 bg-gray-100 border-t-4 border-black text-[10px] font-black uppercase opacity-60">
                Reply directly to this email • George Ongoro
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <History size={24} className="text-accent" />
            <h2 className="text-3xl font-black uppercase italic">Sent History</h2>
          </div>
          
          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="py-20 text-center brutal-border border-dashed bg-muted/30 opacity-60">
                <p className="text-xl font-black uppercase tracking-widest">No transmissions logged</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue._id} 
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 brutal-border bg-card transition-all hover:bg-muted/10"
                >
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">
                      {issue.subject}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span className="h-1 w-1 bg-foreground/20 rounded-full" />
                      <span className={cn(issue.published ? "text-green-600" : "text-yellow-600")}>
                        {issue.published ? "Live Archive" : "Internal Test"}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteIssue(issue._id)}
                    className="h-12 w-12 flex items-center justify-center brutal-border bg-destructive text-destructive-foreground hover:bg-red-700 transition-all"
                    title="Delete Entry"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-left: 2px solid black;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border: 2px solid black;
        }
      `}</style>
    </div>
  )
}
