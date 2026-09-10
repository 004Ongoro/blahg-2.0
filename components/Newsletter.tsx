'use client'

import { useState } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Successfully subscribed!')
        setEmail('')
      } else {
        toast.error(data.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm">
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 -mr-20 -mt-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono font-bold uppercase tracking-wider">
          <Mail className="h-3.5 w-3.5" />
          <span>Newsletter</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-foreground">
          Join the <span className="text-accent">Weekly Dispatches</span>
        </h3>

        <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-sans">
          Deep dives on software engineering, web architecture, and building modern systems. Direct to your inbox, no spam.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email..."
            required
            className="flex-1 bg-background text-foreground px-4 py-3 text-sm font-sans rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-accent-foreground px-6 py-3 font-mono font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {loading ? (
              'Subscribing...'
            ) : (
              <>
                <span>Subscribe</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
