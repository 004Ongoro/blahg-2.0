'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Send, User, Terminal, Database, Shield } from 'lucide-react'
import { FormattedDate } from '@/components/FormattedDate'
import { cn } from '@/lib/utils'

interface Entry {
  _id: string
  name: string
  message: string
  createdAt: string
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/guestbook')
      const data = await res.json()
      setEntries(data)
    } catch (err) {
      console.error('Failed to fetch entries', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })

      if (res.ok) {
        setName('')
        setMessage('')
        fetchEntries()
      }
    } catch (err) {
      console.error('Failed to post entry', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-mono">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Guest<span className="text-accent italic">book</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Leave a message in the digital log. Say hi, or just leave your mark.
          </p>
        </header>

        <div className="space-y-20">
          {/* Form Section */}
          <section className="border-t-2 border-foreground pt-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Sign the Log</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest px-1">
                    Identity
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your handle..."
                    required
                    className="w-full bg-background border border-foreground/10 rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:ring-1 ring-accent transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest px-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  required
                  className="w-full bg-background border border-foreground/10 rounded-xl min-h-[120px] p-4 text-sm font-medium focus:outline-none focus:ring-1 ring-accent transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-foreground text-background font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting...' : (
                  <>
                    Commit to Log
                    <Send size={14} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Entries Section */}
          <section className="space-y-10">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Transmission Archive</h2>
              <span className="text-[10px] font-black uppercase bg-foreground/5 px-2 py-0.5 rounded">
                {entries.length} RECORDS
              </span>
            </div>

            <div className="divide-y divide-foreground/5">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="py-8 space-y-4 animate-pulse">
                    <div className="h-4 w-32 bg-foreground/5 rounded" />
                    <div className="h-20 w-full bg-foreground/5 rounded" />
                  </div>
                ))
              ) : entries.map((entry) => (
                <div key={entry._id} className="py-8 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-[10px] font-black uppercase">
                        {entry.name.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight">{entry.name}</h3>
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Authenticated</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/40">
                      <FormattedDate date={entry.createdAt} />
                    </span>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-foreground pl-11">
                    "{entry.message}"
                  </p>
                </div>
              ))}

              {!isLoading && entries.length === 0 && (
                <div className="py-20 text-center opacity-40">
                  <p className="text-sm font-black uppercase tracking-widest">Buffer is empty</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
