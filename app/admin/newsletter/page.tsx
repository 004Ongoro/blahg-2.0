'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { Trash2, Eye, Send, History, CheckCircle2, AlertTriangle, Users, Mail, CheckSquare, Square } from 'lucide-react'
import Link from 'next/link'

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

  // Fetch existing issues and subscribers
  const fetchData = async () => {
    try {
      const [issuesRes, subsRes] = await Promise.all([
        fetch('/api/admin/newsletter'),
        fetch('/api/admin/subscribers')
      ])
      
      if (issuesRes.ok) {
        const data = await issuesRes.json()
        setIssues(data)
      }
      
      if (subsRes.ok) {
        const data = await subsRes.json()
        const activeSubs = data.filter((s: any) => s.active)
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
    if (!confirm('Permanently remove this issue from the public archive?')) return
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
    <div className="min-h-screen bg-background pb-20">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl font-black uppercase italic">
            Broadcast <span className="text-accent">Center</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/admin/newsletter/events"
              className="flex items-center justify-center gap-2 brutal-border bg-white px-4 py-2 font-black uppercase text-xs hover:bg-accent transition-colors"
            >
              <Mail size={16} /> Email Events
            </Link>
            <Link 
              href="/admin/newsletter/subscribers"
              className="flex items-center justify-center gap-2 brutal-border bg-white px-4 py-2 font-black uppercase text-xs hover:bg-accent transition-colors"
            >
              <Users size={16} /> Manage Subscribers
            </Link>
            <button 
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="lg:hidden flex items-center justify-center gap-2 brutal-border bg-secondary px-4 py-2 font-bold uppercase text-xs"
            >
              <Eye size={16} /> {showPreviewMobile ? 'Edit Content' : 'Preview Email'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Composer Panel */}
          <div className={`flex flex-col gap-6 ${showPreviewMobile ? 'hidden lg:flex' : 'flex'}`}>
            <form 
              onSubmit={handleSend} 
              className="flex flex-col gap-6 brutal-border bg-card p-6 brutal-shadow"
            >
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Subject Line</label>
                <input 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                  className="w-full brutal-border bg-background px-4 py-3 text-lg font-bold focus:ring-4 ring-accent outline-none"
                  placeholder="The Latest Updates..."
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold uppercase text-accent">Message Content</label>
                  <button 
                    type="button" 
                    onClick={() => setIsMarkdown(!isMarkdown)}
                    className="text-[10px] brutal-border px-2 py-1 font-bold bg-secondary hover:bg-accent transition-colors"
                  >
                    MODE: {isMarkdown ? 'MARKDOWN' : 'PLAIN TEXT'}
                  </button>
                </div>
                <textarea 
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  rows={10}
                  className="w-full brutal-border bg-background px-4 py-3 font-mono text-base focus:ring-4 ring-accent outline-none"
                  placeholder={isMarkdown ? "# Hello\nYour markdown here..." : "Type plain message here..."}
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="archive-toggle"
                  checked={publishToArchive}
                  onChange={e => setPublishToArchive(e.target.checked)}
                  className="w-5 h-5 accent-accent cursor-pointer"
                />
                <label htmlFor="archive-toggle" className="text-sm font-bold uppercase cursor-pointer">
                  Publish to Public Archive
                </label>
              </div>

              {/* Recipient Selection */}
              <div className="brutal-border bg-white p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black uppercase flex items-center gap-2">
                    <Mail size={16} className="text-accent" /> Recipients ({selectedSubscribers.length})
                  </h3>
                  <button 
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[10px] font-black uppercase underline hover:text-accent"
                  >
                    {selectedSubscribers.length === subscribers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="max-h-40 overflow-y-auto grid gap-2 pr-2 custom-scrollbar">
                  {subscribers.length === 0 ? (
                    <p className="text-xs italic text-muted-foreground">No active subscribers found.</p>
                  ) : (
                    subscribers.map((sub) => (
                      <button
                        key={sub._id}
                        type="button"
                        onClick={() => toggleSubscriber(sub.email)}
                        className={`flex items-center gap-3 p-2 text-left text-xs font-bold border-2 transition-colors ${
                          selectedSubscribers.includes(sub.email) 
                            ? 'border-black bg-accent/20' 
                            : 'border-transparent hover:border-black/10'
                        }`}
                      >
                        {selectedSubscribers.includes(sub.email) 
                          ? <CheckSquare size={14} className="text-accent" /> 
                          : <Square size={14} className="text-muted-foreground" />
                        }
                        <span className="truncate">{sub.email}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <button 
                disabled={sending}
                className="brutal-btn bg-accent text-accent-foreground py-4 font-black uppercase text-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {sending ? 'Blasting...' : <><Send size={24} /> Blast Newsletter</>}
              </button>

              {status.msg && (
                <div className={`flex items-center gap-3 font-bold p-3 brutal-border ${status.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
                  {status.msg}
                </div>
              )}
            </form>
          </div>

          {/* Responsive Preview Panel */}
          <div className={`${showPreviewMobile ? 'flex' : 'hidden lg:flex'} flex-col gap-4`}>
            <h2 className="font-black uppercase text-sm italic flex items-center gap-2">
              <Eye size={18} className="text-accent"/> Live Email Preview
            </h2>
            <div className="brutal-border bg-white p-4 md:p-8 brutal-shadow overflow-y-auto max-h-[650px] text-black">
              <div style={{ backgroundColor: '#fb923c', padding: '20px', borderBottom: '4px solid #000', marginBottom: '20px' }}>
                <h1 className="text-xl md:text-2xl font-black uppercase m-0 leading-tight">
                  {subject || 'SUBJECT PREVIEW'}
                </h1>
              </div>
              <div 
                className="prose prose-orange max-w-none" 
                dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400 italic">Body content will appear here...</p>' }} 
              />
              <div className="mt-8 pt-8 border-t-4 border-black bg-gray-100 p-4 text-xs font-bold">
                <p>Reply to this email directly! I read every reply.</p>
                <p className="mt-2 text-gray-500 italic">Sent to subscribers of georgeongoro.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* History / Archive Management Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-black uppercase mb-8 italic flex items-center gap-3">
            <History size={32} className="text-accent" /> Sent <span className="text-accent">History</span>
          </h2>
          
          <div className="grid gap-4">
            {issues.length === 0 ? (
              <div className="brutal-border p-8 text-center bg-card text-muted-foreground font-bold italic">
                No newsletters found in the archive.
              </div>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue._id} 
                  className="brutal-border bg-card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:translate-x-[-2px] transition-transform"
                >
                  <div>
                    <h3 className="font-black uppercase text-lg leading-none mb-1">{issue.subject}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span className="text-accent">|</span>
                      <span className={issue.published ? "text-green-600" : "text-orange-600"}>
                        {issue.published ? "PUBLIC" : "DRAFT/TEST"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => deleteIssue(issue._id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 bg-destructive text-destructive-foreground brutal-border text-xs uppercase font-black hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
