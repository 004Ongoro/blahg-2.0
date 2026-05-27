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
    <div className="min-h-screen flex flex-col font-mono">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 md:py-32 w-full">
        {/* Header HUD Section */}
        <header className="mb-20 relative">
          <div className="absolute -top-10 left-0 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Community_Feed</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            Guest<span className="text-accent italic">book</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-3 py-1 bg-foreground text-background rounded-full flex items-center gap-2">
              <Database size={10} />
              <span className="text-[9px] font-black uppercase tracking-widest">Live_Database</span>
            </div>
            <p className="text-muted-foreground font-medium text-sm md:text-base max-w-lg leading-relaxed">
              Decentralized thoughts and digital signatures from the void. 
              Leave your mark in the logs.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side - Stick HUD */}
          <section className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Terminal size={80} />
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Broadcast Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label htmlFor="name" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Identity
                      </label>
                      <span className="text-[8px] font-bold text-accent/40">Required</span>
                    </div>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter handle..."
                      required
                      className="bg-background/50 border-foreground/5 rounded-2xl h-12 text-sm focus:ring-accent focus:border-accent transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label htmlFor="message" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Payload
                      </label>
                      <span className="text-[8px] font-bold text-accent/40">Max 500 chars</span>
                    </div>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's the status?"
                      required
                      className="bg-background/50 border-foreground/5 rounded-2xl min-h-[120px] text-sm focus:ring-accent focus:border-accent transition-all resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-all active:scale-95 shadow-lg group"
                  >
                    {isSubmitting ? 'Transmitting...' : (
                      <>
                        Commit to Log
                        <Send size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-foreground/5 flex items-center justify-between opacity-40">
                  <div className="flex items-center gap-2">
                    <Shield size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Secure Post</span>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">v2.4.0</span>
                </div>
              </div>
            </div>
          </section>

          {/* Entries Side */}
          <section className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-2">
                <User size={14} className="text-accent" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Transmission History</h2>
              </div>
              <span className="px-2 py-0.5 bg-foreground/5 rounded-full text-[9px] font-black text-muted-foreground/60 tracking-widest">
                {entries.length} RECORDS
              </span>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-foreground/5 rounded-[1.5rem] animate-pulse" />
                ))
              ) : entries.map((entry, i) => (
                <div
                  key={entry._id}
                  className="group bg-background/30 backdrop-blur-sm border border-foreground/5 p-6 rounded-[1.5rem] hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 flex gap-1 opacity-10 group-hover:opacity-30 transition-opacity">
                    <div className="h-1 w-4 bg-foreground" />
                    <div className="h-1 w-1 bg-foreground" />
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black text-[10px]">
                        {entry.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                          {entry.name}
                        </h3>
                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                          Authenticated_User
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                      <FormattedDate date={entry.createdAt} />
                    </span>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute -left-2 top-0 text-accent/20 text-4xl font-serif select-none">"</span>
                    <p className="text-sm md:text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors relative z-10 pl-2">
                      {entry.message}
                    </p>
                  </div>
                </div>
              ))}

              {!isLoading && entries.length === 0 && (
                <div className="text-center py-32 bg-foreground/5 rounded-[2rem] border border-dashed border-foreground/10">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <MessageSquare size={40} />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">Buffer is empty</p>
                    <p className="text-[10px] font-medium">Be the first to transmit a message.</p>
                  </div>
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
