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
  Mail,
  Layers,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'subscribe' | 'unsubscribe'

const testimonials = [
  {
    name: "Paul Marc",
    handle: "@paulmarc",
    text: "I keep learning new things, I like it ;)",
    color: "bg-yellow-200"
  },
  {
    name: "Isaac de Andrade",
    handle: "@andradei",
    text: "Good read. Short and to the point.",
    color: "bg-blue-200"
  },
  {
    name: "Rafael",
    handle: "@rafaelnacle",
    text: "Quality content every single time.",
    color: "bg-green-200"
  }
]

const techStack = ["Next.js", "TypeScript", "MongoDB", "Architecture", "Serverless", "Security", "Optimization"]

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
    <div className="min-h-screen flex flex-col font-mono bg-background">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        
        {/* Header Section */}
        <header className="mb-16">
          <div className="inline-block bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase mb-6 tracking-widest">
            Dispatch Center
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.8]">
            The <span className="text-accent italic">Dispatch</span>
          </h1>
          <p className="text-xl font-bold max-w-2xl leading-tight">
            Weekly thoughts on software, design, and building in the open. 
            No spam, just pure signal delivered to your inbox.
          </p>
        </header>

        {/* Main Subscription Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 brutal-border brutal-shadow bg-card overflow-hidden mb-24">
          
          {/* Left Column: Perks */}
          <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r-4 border-foreground bg-accent text-accent-foreground">
            <h2 className="text-xl font-black uppercase mb-8 tracking-tight">Membership Benefits</h2>

            <div className="space-y-6">
              {[
                { icon: <Zap size={20} />, title: "Technical Deep Dives", desc: "Complex concepts explained simply." },
                { icon: <Shield size={20} />, title: "Privacy First", desc: "Your data is never shared or sold." },
                { icon: <Sparkles size={20} />, title: "Early Access", desc: "First looks at new projects and tools." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-foreground text-background p-2 brutal-border shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm mb-1">{item.title}</h3>
                    <p className="text-xs font-bold opacity-90 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interaction */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-background">
            {/* Mode Switcher */}
            <div className="flex brutal-border mb-10 bg-muted overflow-hidden">
              <button
                onClick={() => { setMode('subscribe'); setStatus(null); }}
                className={cn(
                  "flex-1 py-3 font-black uppercase text-xs tracking-widest transition-colors border-r-4 border-foreground",
                  mode === 'subscribe' ? "bg-foreground text-background" : "hover:bg-foreground/10"
                )}
              >
                Subscribe
              </button>
              <button
                onClick={() => { setMode('unsubscribe'); setStatus(null); }}
                className={cn(
                  "flex-1 py-3 font-black uppercase text-xs tracking-widest transition-colors",
                  mode === 'unsubscribe' ? "bg-destructive text-destructive-foreground" : "hover:bg-destructive/10"
                )}
              >
                Unsubscribe
              </button>
            </div>

            <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter italic">
              {mode === 'subscribe' ? 'Join the community' : 'Manage subscription'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full brutal-border bg-background px-4 py-4 text-lg font-bold focus:ring-4 ring-accent outline-none placeholder:opacity-30 border-black"
              />

              <button
                disabled={loading}
                className={cn(
                  "w-full brutal-btn py-5 text-xl font-black uppercase flex items-center justify-center gap-3 disabled:opacity-50 transition-all",
                  mode === 'subscribe' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                )}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {mode === 'subscribe' ? 'Start Receiving' : 'Remove Email'}
                    {mode === 'subscribe' && <Send size={24} />}
                  </>
                )}
              </button>
            </form>

            {status && (
              <div className={cn(
                "mt-8 p-4 brutal-border flex items-center gap-3 font-black uppercase text-sm",
                status.type === 'success' ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
              )}>
                {status.type === 'success' ? <CheckCircle2 /> : <XCircle />}
                {status.msg}
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <section className="mb-24">
          <h3 className="text-4xl font-black uppercase italic text-center mb-12">
            What <span className="text-accent underline decoration-4 underline-offset-4">Developers</span> Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "p-8 brutal-border brutal-shadow min-h-[200px] flex flex-col justify-between transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                  t.color
                )}
              >
                <Quote className="opacity-20 mb-6" size={40} />
                <p className="text-lg font-black leading-tight mb-8">"{t.text}"</p>
                <div>
                  <div className="font-black uppercase text-sm">{t.name}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">{t.handle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Archive Hook */}
        <div className="max-w-4xl mx-auto">
          <div className="brutal-border brutal-shadow bg-card p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail size={160} />
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black uppercase italic mb-4">Want to see past issues?</h3>
            <p className="text-xl font-bold text-muted-foreground mb-8">
              Explore our full catalog of deep dives into code and architecture.
            </p>
            
            <Link 
              href="/newsletter/archive"
              className="brutal-btn bg-background text-foreground px-10 py-5 font-black uppercase inline-flex items-center gap-3 text-2xl hover:bg-accent hover:text-accent-foreground"
            >
              Browse Archive <ArrowRight size={28} />
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
