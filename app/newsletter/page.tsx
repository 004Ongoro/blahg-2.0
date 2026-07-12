'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { 
  CheckCircle2, 
  XCircle, 
  Send, 
  Loader2, 
  Zap, 
  Shield, 
  Sparkles, 
  Quote, 
  ArrowRight, 
  Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'subscribe' | 'unsubscribe'

const testimonials = [
  {
    name: "Paul Marc",
    handle: "@paulmarc",
    text: "I keep learning new things, I like it ;)",
  },
  {
    name: "Isaac de Andrade",
    handle: "@andradei",
    text: "Good read. Short and to the point.",
  },
  {
    name: "Rafael",
    handle: "@rafaelnacle",
    text: "Quality content every single time.",
  }
]

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
            ? "Successfully subscribed. Check your inbox!" 
            : "Successfully unsubscribed. We'll miss you."
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            The <span className="text-accent italic">Dispatch</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Weekly thoughts on software, design, and building things. 
            Delivered directly to your inbox.
          </p>
        </header>

        {/* Main Interaction Area */}
        <div className="space-y-12">
          
          {/* Form Card */}
          <div className="border border-foreground/5 p-8 md:p-12 rounded-2xl bg-foreground/[0.01]">
            <div className="flex gap-4 mb-10">
              <button
                onClick={() => { setMode('subscribe'); setStatus(null); }}
                className={cn(
                  "text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                  mode === 'subscribe' ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Subscribe
              </button>
              <button
                onClick={() => { setMode('unsubscribe'); setStatus(null); }}
                className={cn(
                  "text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                  mode === 'unsubscribe' ? "border-destructive text-destructive" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Unsubscribe
              </button>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
              {mode === 'subscribe' ? 'Join the community' : 'Manage subscription'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-4 text-base font-medium focus:outline-none focus:ring-1 ring-accent transition-all"
              />

              <button
                disabled={loading}
                className={cn(
                  "w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                  mode === 'subscribe' ? "bg-foreground text-background hover:opacity-90" : "bg-destructive text-destructive-foreground hover:opacity-90"
                )}
              >
                {loading ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <>
                    {mode === 'subscribe' ? 'Start Receiving' : 'Remove Email'}
                    {mode === 'subscribe' && <Send size={16} />}
                  </>
                )}
              </button>
            </form>

            {status && (
              <div className={cn(
                "mt-8 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border",
                status.type === 'success' ? "bg-green-500/5 text-green-600 border-green-500/10" : "bg-destructive/5 text-destructive border-destructive/10"
              )}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {status.msg}
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-foreground/5">
            {[
              { icon: <Zap size={18} className="text-accent" />, title: "Insights", desc: "Technical deep dives." },
              { icon: <Shield size={18} className="text-accent" />, title: "Privacy", desc: "No spam, no selling." },
              { icon: <Sparkles size={18} className="text-accent" />, title: "Early Access", desc: "First looks at projects." }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                  {item.icon} {item.title}
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <section className="mt-24 pt-16 border-t border-foreground/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-12">Readers Feedback</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="space-y-4">
                <p className="text-sm font-medium leading-relaxed italic">"{t.text}"</p>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest">{t.name}</div>
                  <div className="text-[10px] font-bold text-muted-foreground/50">{t.handle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Archive Hook */}
        <div className="mt-24">
          <Link 
            href="/newsletter/archive"
            className="group flex flex-col p-8 rounded-2xl border border-foreground/5 hover:border-accent/20 bg-foreground/[0.01] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent px-2 py-1 rounded">Knowledge Base</span>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Browse Archive</h3>
            <p className="text-sm font-medium text-muted-foreground">
              Explore past issues on code, architecture, and design.
            </p>
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  )
}
