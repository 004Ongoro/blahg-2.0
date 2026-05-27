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
  Terminal,
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
    <div className="min-h-screen flex flex-col font-mono overflow-x-hidden">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-20 md:py-32 w-full">
        
        {/* Header HUD */}
        <header className="mb-20 relative text-center flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Dispatch_Center</span>
            <div className="h-[1px] w-8 bg-foreground" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            The <span className="text-accent italic">Dispatch</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-lg leading-relaxed text-balance">
            Weekly thoughts on software, design, and building in the open. 
            No spam, just pure signal delivered to your inbox.
          </p>
        </header>

        {/* Main Subscription Card */}
        <div className="relative mb-32">
          {/* Background Decoration */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Column: Perks */}
            <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-foreground/5 bg-foreground/[0.02]">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Membership Benefits</h2>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <Zap size={18} className="text-accent" />, title: "Technical Deep Dives", desc: "Complex concepts explained simply." },
                  { icon: <Shield size={18} className="text-accent" />, title: "Privacy First", desc: "Your data is never shared or sold." },
                  { icon: <Sparkles size={18} className="text-accent" />, title: "Early Access", desc: "First looks at new projects and tools." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-background border border-foreground/5 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest mb-1">{item.title}</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-foreground/5 opacity-40">
                <div className="flex items-center gap-3">
                  <Activity size={12} />
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Uptime: 99.9% Reliable</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interaction */}
            <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-background/20">
              {/* Pill Switcher */}
              <div className="inline-flex p-1 bg-foreground/5 rounded-full mb-10 self-center md:self-start">
                <button
                  onClick={() => { setMode('subscribe'); setStatus(null); }}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    mode === 'subscribe' ? "bg-foreground text-background shadow-lg" : "text-muted-foreground/60 hover:text-foreground"
                  )}
                >
                  Subscribe
                </button>
                <button
                  onClick={() => { setMode('unsubscribe'); setStatus(null); }}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    mode === 'unsubscribe' ? "bg-destructive text-destructive-foreground shadow-lg" : "text-muted-foreground/60 hover:text-foreground"
                  )}
                >
                  Unsubscribe
                </button>
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
                {mode === 'subscribe' ? 'Join the community' : 'Manage your subscription'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-accent transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full bg-background/50 border border-foreground/5 rounded-2xl pl-12 pr-6 py-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-inner"
                  />
                </div>

                <button
                  disabled={loading}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl",
                    mode === 'subscribe' ? "bg-foreground text-background hover:bg-accent hover:text-accent-foreground" : "bg-destructive text-destructive-foreground opacity-90 hover:opacity-100"
                  )}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {mode === 'subscribe' ? 'Start Receiving' : 'Remove Email'}
                      {mode === 'subscribe' && <Send size={14} />}
                    </>
                  )}
                </button>
              </form>

              {status && (
                <div className={cn(
                  "mt-8 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest border animate-in fade-in slide-in-from-top-2",
                  status.type === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                )}>
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {status.msg}
                </div>
              )}

              <p className="mt-8 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] text-center md:text-left">
                Trusted by developers globally.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">What readers are saying</h3>
            <div className="h-px flex-1 bg-foreground/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-background/30 backdrop-blur-sm border border-foreground/5 p-8 rounded-[2rem] relative group"
              >
                <Quote className="absolute top-6 right-8 text-accent/10 group-hover:text-accent/20 transition-colors" size={32} />
                <p className="text-sm font-medium leading-relaxed mb-8 relative z-10 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-[10px] font-black uppercase">
                    {t.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">{t.name}</div>
                    <div className="text-[9px] font-bold text-muted-foreground/40">{t.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Tech Marquee */}
        <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-foreground/5 py-8 overflow-hidden mb-32 rotate-[-1deg]">
          <div className="flex gap-16 whitespace-nowrap animate-marquee">
            {[...techStack, ...techStack, ...techStack].map((tech, i) => (
              <div key={i} className="flex items-center gap-8">
                <span className="text-2xl md:text-4xl font-black uppercase tracking-tighter opacity-20">
                  {tech}
                </span>
                <div className="h-2 w-2 rounded-full bg-accent opacity-40" />
              </div>
            ))}
          </div>
        </div>

        {/* Archive Hook */}
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/newsletter/archive"
            className="group block bg-background/50 backdrop-blur-md border border-foreground/5 p-12 rounded-[2.5rem] text-center hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 rounded-full mb-6">
                <Layers size={12} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Knowledge Base</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">Want to see past issues?</h3>
              <p className="text-sm font-medium text-muted-foreground mb-8 max-w-sm mx-auto">
                Explore our full catalog of deep dives into code and architecture.
              </p>
              
              <div className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                Browse Archive <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

      </main>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
      
      <Footer />
    </div>
  )
}
