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
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-mono bg-background">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-20">
          <div className="inline-block bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase mb-6 tracking-widest">
            Community Feed
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.8]">
            Guest<span className="text-accent italic">book</span>
          </h1>
          <p className="text-xl font-bold max-w-2xl leading-tight">
            Decentralized thoughts and digital signatures from the void. 
            Leave your mark in the logs.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <section className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="brutal-border brutal-shadow bg-card p-8 relative overflow-hidden group">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8 italic flex items-center gap-2">
                  <Terminal size={24} className="text-accent" /> Sign the log
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-black uppercase tracking-widest">
                      Identity
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter handle..."
                      required
                      className="w-full brutal-border bg-background h-12 px-4 font-bold focus:ring-4 ring-accent outline-none border-black"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-black uppercase tracking-widest">
                      Payload
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's the status?"
                      required
                      className="w-full brutal-border bg-background min-h-[150px] p-4 font-bold focus:ring-4 ring-accent outline-none resize-none border-black"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full brutal-btn py-4 bg-accent text-accent-foreground font-black uppercase text-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Transmitting...' : (
                      <>
                        Commit to Log
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Entries Side */}
          <section className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight italic flex items-center gap-2">
                <Database size={24} className="text-accent" /> Records
              </h2>
              <div className="bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase">
                {entries.length} Entries
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 brutal-border bg-muted animate-pulse" />
                ))
              ) : entries.map((entry) => (
                <div
                  key={entry._id}
                  className="brutal-border brutal-shadow bg-card p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-accent brutal-border flex items-center justify-center text-accent-foreground font-black text-lg">
                        {entry.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black uppercase text-base leading-none mb-1">
                          {entry.name}
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Verified User
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-2 py-1 brutal-border">
                      <FormattedDate date={entry.createdAt} />
                    </span>
                  </div>
                  
                  <div className="relative">
                    <p className="text-lg font-bold leading-snug text-foreground">
                      "{entry.message}"
                    </p>
                  </div>
                </div>
              ))}

              {!isLoading && entries.length === 0 && (
                <div className="text-center py-20 brutal-border border-dashed bg-muted/30 opacity-60">
                  <MessageSquare size={48} className="mx-auto mb-4" />
                  <p className="text-xl font-black uppercase tracking-widest">No transmissions found</p>
                  <p className="font-bold">Be the first to leave a message.</p>
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
