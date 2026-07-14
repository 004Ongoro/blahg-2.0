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
      setStatus({ type: 'error', msg: 'Select recipients' })
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
        setStatus({ type: 'success', msg: `Broadcast successfully sent!` })
        setSubject('')
        setContent('')
        fetchData()
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
      
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-12 border-b-2 border-foreground pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded mb-2 inline-block">Dispatch_Studio</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Broad<span className="text-accent italic">cast</span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link 
                href="/admin/newsletter/events"
                className="h-10 px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border border-foreground/5 rounded-full"
              >
                <Activity size={14} /> Events
              </Link>
              <Link 
                href="/admin/newsletter/subscribers"
                className="h-10 px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border border-foreground/5 rounded-full"
              >
                <Users size={14} /> Audience
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 mb-20">
          {/* Composer Panel */}
          <div className={cn("space-y-12", showPreviewMobile && "hidden lg:block")}>
            <form onSubmit={handleSend} className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-foreground/5 pb-2">1. Message Configuration</h2>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Subject</label>
                  <input 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-background border-b-2 border-foreground/10 py-2 text-xl font-black uppercase tracking-tight focus:outline-none focus:border-accent transition-all"
                    placeholder="Enter subject line..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Content</label>
                    <button 
                      type="button" 
                      onClick={() => setIsMarkdown(!isMarkdown)}
                      className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-foreground/5 rounded-full hover:bg-accent hover:text-white transition-all"
                    >
                      Format: {isMarkdown ? 'Markdown' : 'Plain Text'}
                    </button>
                  </div>
                  <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    className="w-full bg-background border border-foreground/5 rounded-2xl p-6 font-mono text-sm focus:outline-none focus:ring-1 ring-accent transition-all resize-none leading-relaxed min-h-[400px]"
                    placeholder="Compose your transmission..."
                    required
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-fit px-1">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={publishToArchive}
                      onChange={e => setPublishToArchive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-foreground/10 rounded-full p-0.5 transition-all" />
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-background rounded-full shadow-sm transition-all peer-checked:translate-x-4 peer-checked:bg-accent" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                    Public Archive Mirror
                  </span>
                </label>
              </div>

              {/* Recipient Selection */}
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-foreground/5 pb-2">
                  <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">2. Recipient Selector</h2>
                  <button 
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    {selectedSubscribers.length === subscribers.length ? 'Clear_Selection' : 'Select_All_Active'}
                  </button>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter by email..."
                    className="w-full bg-background border border-foreground/10 rounded-full pl-12 pr-4 h-11 text-sm font-medium focus:outline-none focus:ring-1 ring-accent transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-y border-foreground/5 py-6">
                  {filteredSubscribers.length === 0 ? (
                    <div className="col-span-full py-10 text-center opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-widest">No matching records</p>
                    </div>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <button
                        key={sub._id}
                        type="button"
                        onClick={() => toggleSubscriber(sub.email)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                          selectedSubscribers.includes(sub.email) 
                            ? "bg-accent/5 border-accent/20 text-accent" 
                            : "bg-background border-foreground/5 text-muted-foreground hover:border-foreground/20"
                        )}
                      >
                        {selectedSubscribers.includes(sub.email) 
                          ? <CheckSquare size={14} /> 
                          : <Square size={14} className="opacity-40" />
                        }
                        <span className="text-[10px] font-bold truncate tracking-tight">{sub.email}</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between opacity-40">
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    Payload_Target: {selectedSubscribers.length} / {subscribers.length} Nodes
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
                  <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">3. System Preview</h2>
                  <button
                    type="button"
                    onClick={() => setShowPreviewMobile(!showPreviewMobile)}
                    className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    {showPreviewMobile ? 'Hide_Preview' : 'Show_Preview'}
                  </button>
                </div>

                {showPreviewMobile && (
                  <div className="border border-foreground/5 rounded-2xl overflow-hidden bg-white text-black min-h-[500px] flex flex-col animate-in fade-in slide-in-from-top-2">
                    <div className="p-8 bg-gray-50 border-b border-foreground/5">
                      <h1 className="text-xl font-black uppercase tracking-tighter leading-tight m-0">
                        {subject || 'SUBJECT_PREVIEW'}
                      </h1>
                    </div>
                    <div className="p-8 flex-1">
                      <div 
                        className="prose prose-neutral max-w-none text-sm leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400 italic">No content rendered...</p>' }} 
                      />
                    </div>
                    <div className="p-6 bg-gray-50 border-t border-foreground/5 text-[9px] font-black uppercase opacity-40 tracking-widest">
                      Transmission Protocol v2.1.0 • George Ongoro
                    </div>
                  </div>
                )}
              </div>

              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl px-4">
                <button 
                  disabled={sending}
                  className="w-full h-14 bg-foreground text-background rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Send size={16} /> 
                      Blast_Dispatch
                    </>
                  )}
                </button>
              </div>

              {status.msg && (
                <div className={cn(
                  "p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border animate-in fade-in slide-in-from-top-2",
                  status.type === 'success' ? "bg-green-500/5 text-green-600 border-green-500/10" : "bg-destructive/5 text-destructive border-destructive/10"
                )}>
                  {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}
                  {status.msg}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* History Section */}
        <section className="mt-32">
          <div className="flex items-center gap-4 mb-8 border-b border-foreground/5 pb-4">
            <History size={16} className="text-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sent Transmissions</h2>
          </div>
          
          <div className="divide-y divide-foreground/5">
            {issues.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No activity logged</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue._id} 
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6"
                >
                  <div className="min-w-0">
                    <h3 className="text-base font-black uppercase tracking-tight mb-1 truncate group-hover:text-accent transition-colors">
                      {issue.subject}
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span className={cn(issue.published ? "text-accent/60" : "opacity-40")}>
                        {issue.published ? "PUBLIC_ARCHIVE" : "INTERNAL_TEST"}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteIssue(issue._id)}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                    title="Purge Entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.03);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
