'use client'

import { useState, useMemo } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export default function AdminNewsletter() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isMarkdown, setIsMarkdown] = useState(true)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({ type: '', msg: '' })

  const previewHtml = useMemo(() => {
    if (!content) return ''
    if (!isMarkdown) return `<div style="white-space: pre-wrap;">${content}</div>`
    try {
      return unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).processSync(content).toString()
    } catch { return 'Error rendering preview' }
  }, [content, isMarkdown])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setStatus({ type: '', msg: '' })

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, isMarkdown }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Newsletter blasted successfully!' })
        setSubject(''); setContent('')
      } else {
        setStatus({ type: 'error', msg: data.error })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Failed to connect to server' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black uppercase mb-8 italic">Broadcast <span className="text-accent">Center</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSend} className="flex flex-col gap-6 brutal-border bg-card p-6 brutal-shadow">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">Subject Line</label>
              <input 
                value={subject} 
                onChange={e => setSubject(e.target.value)}
                className="w-full brutal-border bg-background px-4 py-3 text-lg font-bold"
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
                  className="text-xs brutal-border px-2 py-1 font-bold bg-secondary"
                >
                  Mode: {isMarkdown ? 'Markdown' : 'Plain Text'}
                </button>
              </div>
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)}
                rows={12}
                className="w-full brutal-border bg-background px-4 py-3 font-mono text-base"
                placeholder={isMarkdown ? "# Hello\nYour markdown here..." : "Type plain message here..."}
                required
              />
            </div>

            <button 
              disabled={sending}
              className="brutal-btn bg-accent text-accent-foreground py-4 font-black uppercase text-xl disabled:opacity-50"
            >
              {sending ? 'Sending Broadcast...' : 'Blast Newsletter'}
            </button>
            {status.msg && (
              <p className={`text-center font-bold p-2 brutal-border ${status.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
                {status.msg}
              </p>
            )}
          </form>

          <div className="hidden lg:flex flex-col gap-4">
            <h2 className="font-black uppercase text-sm italic">Email Preview (approximate)</h2>
            <div className="brutal-border bg-white p-8 brutal-shadow overflow-y-auto max-h-[600px] text-black">
              <div style={{ backgroundColor: '#fb923c', padding: '20px', borderBottom: '4px solid #000', marginBottom: '20px' }}>
                <h1 className="text-2xl font-black uppercase m-0 leading-tight">{subject || 'SUBJECT PREVIEW'}</h1>
              </div>
              <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400 italic">Body content will appear here...</p>' }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}