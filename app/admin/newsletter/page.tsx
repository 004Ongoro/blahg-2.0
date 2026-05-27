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
  Terminal,
  Activity,
  Layers,
  Search
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
      setStatus({ type: 'error', msg: 'Please select at least one recipient' })
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
        setStatus({ type: 'success', msg: `Broadcast successfully sent to ${selectedSubscribers.length} recipients!` })
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
    if (!confirm('Are you sure you want to remove this issue from the public archive?')) return
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
      
      <main className="max-w-7xl mx-auto px-4 py-32 w-full">
        {/* Header HUD Section */}
        <header className="mb-12 relative">
          <div className="absolute -top-10 left-0 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Broadcast_Center</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
                  <Mail size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Email_Dispatch</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Broadcast_<span className="text-accent italic">Studio</span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/newsletter/events"
                className="h-10 px-6 flex items-center gap-2 bg-background/50 backdrop-blur-md border border-foreground/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-sm"
              >
                <Activity size={14} /> View Events
              </Link>
              <Link 
                href="/admin/newsletter/subscribers"
                className="h-10 px-6 flex items-center gap-2 bg-background/50 backdrop-blur-md border border-foreground/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-sm"
              >
                <Users size={14} /> Manage Audience
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Composer HUD Panel */}
          <div className={cn("lg:col-span-7 space-y-6", showPreviewMobile && "hidden lg:block")}>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="bg-background/40 backdrop-blur-xl border border-foreground/5 rounded-[2rem] p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Message_Configuration</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Email Subject</label>
                  <input 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-background/50 border border-foreground/5 rounded-2xl h-12 px-4 text-sm font-bold focus:ring-accent focus:border-accent transition-all"
                    placeholder="Enter the subject line..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Message Body</label>
                    <button 
                      type="button" 
                      onClick={() => setIsMarkdown(!isMarkdown)}
                      className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-foreground/5 rounded-full hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      Format: {isMarkdown ? 'Markdown' : 'Plain Text'}
                    </button>
                  </div>
                  <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    className="w-full bg-background/50 border border-foreground/5 rounded-2xl p-6 font-mono text-sm focus:ring-accent focus:border-accent transition-all resize-none leading-relaxed"
                    placeholder="Compose your message here..."
                    required
                  />
                </div>

                <div className="flex items-center gap-3 px-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                      "w-10 h-6 rounded-full p-1 transition-all",
                      publishToArchive ? "bg-accent" : "bg-foreground/10"
                    )}>
                      <div className={cn(
                        "h-4 w-4 rounded-full bg-background transition-all shadow-sm",
                        publishToArchive ? "translate-x-4" : "translate-x-0"
                      )} />
                    </div>
                    <input 
                      type="checkbox" 
                      checked={publishToArchive}
                      onChange={e => setPublishToArchive(e.target.checked)}
                      className="hidden"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground">
                      Public Archive Mirror
                    </span>
                  </label>
                </div>
              </div>

              {/* Recipient Selection HUD */}
              <div className="bg-background/40 backdrop-blur-xl border border-foreground/5 rounded-[2rem] p-8 shadow-2xl space-y-4">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recipient_Selector</span>
                  </div>
                  <button 
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[9px] font-black uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-full hover:bg-foreground hover:text-background transition-all"
                  >
                    {selectedSubscribers.length === subscribers.length ? 'Clear Selection' : 'Select All'}
                  </button>
                </div>

                <div className="relative mb-4">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter audience..."
                    className="w-full bg-background/30 border border-foreground/5 rounded-xl h-10 pl-10 pr-4 text-xs font-medium focus:ring-accent transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSubscribers.length === 0 ? (
                    <div className="col-span-full py-10 text-center opacity-20">
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
                            ? "bg-accent/10 border-accent/20 text-accent shadow-sm shadow-accent/5" 
                            : "bg-background/20 border-foreground/5 text-muted-foreground hover:border-foreground/20"
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

                <div className="pt-4 border-t border-foreground/5 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                    Total_Selected: {selectedSubscribers.length} / {subscribers.length}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-1 w-1 rounded-full bg-accent/20" />
                    ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={sending}
                className="w-full h-14 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Send size={18} /> 
                    Blast_Dispatch
                  </>
                )}
              </button>

              {status.msg && (
                <div className={cn(
                  "p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border animate-in fade-in slide-in-from-top-2",
                  status.type === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                )}>
                  {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}
                  {status.msg}
                </div>
              )}
            </form>
          </div>

          {/* Preview HUD Panel */}
          <div className={cn("lg:col-span-5 space-y-4", !showPreviewMobile && "hidden lg:block")}>
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visual_Preview</span>
              </div>
              <button 
                onClick={() => setShowPreviewMobile(false)}
                className="lg:hidden text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                Return_to_Composer
              </button>
            </div>

            <div className="bg-background/30 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] p-0 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-8 bg-accent text-accent-foreground border-b border-foreground/5">
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Terminal size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Header_Module</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight m-0">
                  {subject || 'No Subject Defined'}
                </h1>
              </div>

              <div className="p-8 bg-white flex-1 text-black">
                <div 
                  className="prose prose-neutral max-w-none text-sm leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400 italic">Transmission content will appear here...</p>' }} 
                />
              </div>

              <div className="p-6 bg-foreground/[0.02] border-t border-foreground/5">
                <div className="flex items-center justify-between opacity-30">
                  <span className="text-[8px] font-black uppercase tracking-widest text-foreground">Footer_Module</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-foreground">v2.1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History / Archive Section */}
        <section className="relative">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <History size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Transmission_Log</h2>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1 w-6 bg-foreground/10 rounded-full" />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {issues.length === 0 ? (
              <div className="py-20 text-center bg-background/20 rounded-[2.5rem] border border-dashed border-foreground/10 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Log is currently empty</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue._id} 
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-background/40 border border-foreground/5 rounded-2xl hover:border-accent/30 transition-all duration-300"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        issue.published ? "bg-accent" : "bg-muted-foreground/30"
                      )} />
                      <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors">
                        {issue.subject}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest px-4">
                      <span>{new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="h-1 w-1 rounded-full bg-foreground/10" />
                      <span className={cn(issue.published ? "text-accent/60" : "text-muted-foreground/30")}>
                        {issue.published ? "Live_Archive" : "Internal_Draft"}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteIssue(issue._id)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                    title="Delete Entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* System Metadata Footer */}
        <div className="mt-20 pt-12 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
              <span className="text-[10px] font-bold">DISPATCH_v1.4</span>
            </div>
            <div className="h-8 w-px bg-foreground/20" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Security</span>
              <span className="text-[10px] font-bold">AES_256_GCM</span>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-1 bg-foreground/10 rounded-full" />
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
