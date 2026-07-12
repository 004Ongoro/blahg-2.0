'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
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
    <div className="bg-foreground text-background p-8 md:p-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
      
      <div className="relative z-10 max-w-lg">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">
          Join the <span className="text-accent italic">Underground</span>
        </h3>
        <p className="text-sm font-medium opacity-70 mb-8 leading-relaxed">
          Weekly-ish dispatches on software, design, and building in the open. 
          No spam, just signal.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-background text-foreground px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-accent-foreground px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'joining...' : 'subscribe'}
            <Mail size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
