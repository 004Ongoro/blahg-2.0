'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function NewsletterPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Newsletter sent successfully!' })
        setSubject('')
        setContent('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="brutal-border bg-card p-8 brutal-shadow-lg">
          <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">
            Send <span className="text-accent">Newsletter</span>
          </h1>

          {message.text && (
            <div className={`mb-6 p-4 brutal-border font-bold ${
              message.type === 'success' ? 'bg-green-500' : 'bg-destructive text-destructive-foreground'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSend} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="What's the update?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase">Content (HTML allowed)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full brutal-border bg-background px-4 py-3 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Write your newsletter content here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brutal-btn bg-accent text-accent-foreground py-4 font-black uppercase text-xl disabled:opacity-50"
            >
              {loading ? 'Dispatching...' : 'Blast to Subscribers'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}