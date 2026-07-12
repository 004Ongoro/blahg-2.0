'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Send, User } from 'lucide-react'
import { FormattedDate } from '@/components/FormattedDate'

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">
            Guestbook<span className="text-accent">.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Leave a message, say hi, or share a thought. This is a public space for the community.
          </p>
        </header>

        <section className="mb-16">
          <form onSubmit={handleSubmit} className="brutal-border brutal-shadow bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" /> Sign the Guestbook
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-black uppercase mb-1 ml-1 text-muted-foreground">
                  Your Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="George Burdell"
                  required
                  className="brutal-border focus:ring-accent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs font-black uppercase mb-1 ml-1 text-muted-foreground">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  required
                  className="brutal-border focus:ring-accent min-h-[100px]"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="brutal-btn bg-accent text-accent-foreground w-full font-black uppercase py-6 h-auto text-lg"
              >
                {isSubmitting ? 'Posting...' : 'Sign Guestbook'} <Send className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-2">
            <User className="w-6 h-6 text-accent" /> Recent Entries 
            <span className="text-sm font-normal text-muted-foreground ml-2">({entries.length})</span>
          </h2>

          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="brutal-border brutal-shadow bg-card p-6 relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black uppercase text-accent">{entry.name}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    <FormattedDate date={entry.createdAt} />
                  </span>
                </div>
                <p className="text-foreground leading-relaxed italic">
                  "{entry.message}"
                </p>
              </div>
            ))}

            {!isLoading && entries.length === 0 && (
              <div className="text-center py-20 brutal-border border-dashed border-2 opacity-50">
                <p className="font-black uppercase">No entries yet. Be the first!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
