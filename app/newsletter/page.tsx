'use client'


import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CheckCircle2, XCircle, Send, Loader2 } from 'lucide-react'

type Mode = 'subscribe' | 'unsubscribe'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState<Mode>('subscribe')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const endpoint = mode === 'subscribe' ? '/api/subscribe' : '/api/unsubscribe'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({
          type: 'success',
          msg: mode === 'subscribe' 
            ? "Welcome to the inner circle! Check your inbox." 
            : "You've been removed. Sorry to see you go."
        })
        setEmail('')
      } else {
        setStatus({ type: 'error', msg: data.error || 'Something went wrong.' })
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error. Try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full brutal-border brutal-shadow bg-card p-8 md:p-12">
          {/* Mode Toggle */}
          <div className="flex border-b-4 border-foreground mb-8">
            <button
              onClick={() => { setMode('subscribe'); setStatus(null); }}
              className={`flex-1 py-3 font-black uppercase text-sm tracking-tighter transition-colors ${
                mode === 'subscribe' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/10'
              }`}
            >
              Subscribe
            </button>
            <button
              onClick={() => { setMode('unsubscribe'); setStatus(null); }}
              className={`flex-1 py-3 font-black uppercase text-sm tracking-tighter transition-colors ${
                mode === 'unsubscribe' ? 'bg-destructive text-destructive-foreground' : 'hover:bg-destructive/10'
              }`}
            >
              Unsubscribe
            </button>
          </div>

          <h1 className="text-4xl font-black uppercase italic mb-4 leading-none">
            {mode === 'subscribe' ? 'Stay in the' : 'Leave the'} <span className="text-accent">Loop</span>
          </h1>
          
          <p className="text-muted-foreground font-bold mb-8">
            {mode === 'subscribe' 
              ? "Deep dives into web development, architecture, and building in public." 
              : "We're sad to see you go, but we respect your inbox."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full brutal-border bg-background px-4 py-4 text-lg font-bold focus:ring-4 ring-accent outline-none placeholder:opacity-50"
              />
            </div>

            <button
              disabled={loading}
              className={`brutal-btn py-4 text-xl font-black uppercase flex items-center justify-center gap-3 disabled:opacity-50 ${
                mode === 'subscribe' ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {mode === 'subscribe' ? <Send size={24} /> : <XCircle size={24} />}
                  {mode === 'subscribe' ? 'Join Now' : 'Remove Me'}
                </>
              )}
            </button>
          </form>

          {status && (
            <div className={`mt-8 p-4 brutal-border flex items-center gap-3 font-black uppercase text-sm ${
              status.type === 'success' ? 'bg-green-200' : 'bg-red-200'
            }`}>
              {status.type === 'success' ? <CheckCircle2 /> : <XCircle />}
              {status.msg}
            </div>
          )}
        </div>
        
        <p className="mt-8 font-mono text-xs text-muted-foreground uppercase font-bold tracking-widest">
          George Ongoro Newsletter // No Spam. Just Code.
        </p>
      </main>
      <Footer />
    </div>
  )
}