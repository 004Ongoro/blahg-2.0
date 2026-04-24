'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CheckCircle2, XCircle, Send, Loader2, Zap, Shield, Sparkles } from 'lucide-react'

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
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-20">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 brutal-border brutal-shadow bg-card overflow-hidden">
          
          {/* Left Column: Benefits/Hype */}
          <div className="bg-accent text-accent-foreground p-8 md:p-12 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-foreground">
            <div className="inline-block bg-foreground text-background px-3 py-1 text-xs font-black uppercase mb-6 self-start">
              Weekly Insights
            </div>
            <h1 className="text-5xl font-black uppercase italic mb-6 leading-[0.9]">
              The <span className="text-white">Underground</span> Dev
            </h1>
            <p className="text-lg font-bold mb-8 opacity-90">
              Deep dives into high-performance web architecture, building profitable side projects, and the unvarnished truth about tech.
            </p>
            
            <ul className="space-y-4">
              {[
                { icon: <Zap size={20} />, text: "Zero Fluff. Just Code." },
                { icon: <Shield size={20} />, text: "No Spam. Ever." },
                { icon: <Sparkles size={20} />, text: "Exclusive Early Access." }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-black uppercase text-sm">
                  <span className="bg-foreground text-background p-1">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Form */}
          <div className="p-8 md:p-12 bg-background flex flex-col justify-center">
             {/* Mode Toggle */}
            <div className="flex brutal-border mb-8 bg-muted overflow-hidden">
              <button
                onClick={() => { setMode('subscribe'); setStatus(null); }}
                className={`flex-1 py-3 font-black uppercase text-xs tracking-tighter transition-colors ${
                  mode === 'subscribe' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'
                }`}
              >
                Join Now
              </button>
              <button
                onClick={() => { setMode('unsubscribe'); setStatus(null); }}
                className={`flex-1 py-3 font-black uppercase text-xs tracking-tighter transition-colors ${
                  mode === 'unsubscribe' ? 'bg-destructive text-destructive-foreground' : 'hover:bg-destructive/10'
                }`}
              >
                Leave
              </button>
            </div>

            <h2 className="text-2xl font-black uppercase mb-6">
              {mode === 'subscribe' ? 'Ready to level up?' : 'Goodbye, friend.'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@awesome-dev.com"
                  required
                  className="w-full brutal-border bg-background px-4 py-4 text-lg font-bold focus:ring-4 ring-accent outline-none placeholder:opacity-30 border-black"
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
                    {mode === 'subscribe' ? 'Get the newsletter' : 'Unsubscribe'}
                  </>
                )}
              </button>
            </form>

            {status && (
              <div className={`mt-8 p-4 brutal-border flex items-center gap-3 font-black uppercase text-sm ${
                status.type === 'success' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
              }`}>
                {status.type === 'success' ? <CheckCircle2 /> : <XCircle />}
                {status.msg}
              </div>
            )}

            <p className="mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
              Joined by 500+ developers worldwide.
            </p>
          </div>
        </div>
        
        <div className="mt-12 flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden whitespace-nowrap">
           <span className="font-black italic text-2xl uppercase">Next.js</span>
           <span className="font-black italic text-2xl uppercase">TypeScript</span>
           <span className="font-black italic text-2xl uppercase">MongoDB</span>
           <span className="font-black italic text-2xl uppercase">Architecture</span>
           <span className="font-black italic text-2xl uppercase">Next.js</span>
           <span className="font-black italic text-2xl uppercase">TypeScript</span>
        </div>
      </main>
      <Footer />
    </div>
  )
}
