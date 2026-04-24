'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CheckCircle2, XCircle, Send, Loader2, Zap, Shield, Sparkles, Quote, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

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
    text: "Nice!",
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
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12 md:py-20">
        
        {/* Main Hero Card */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 brutal-border brutal-shadow bg-card overflow-hidden mb-16">
          
          {/* Left Column: Benefits/Hype */}
          <div className="bg-accent text-accent-foreground p-8 md:p-12 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-foreground">
            <div className="inline-block bg-foreground text-background px-3 py-1 text-xs font-black uppercase mb-6 self-start">
              Weekly Insights
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic mb-6 leading-[0.8] tracking-tighter">
              The <span className="text-white block sm:inline">Underground</span> Dev
            </h1>
            <p className="text-lg font-bold mb-8 opacity-90 leading-tight">
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
              Joined by developers worldwide.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl w-full mb-20 px-4">
          <h3 className="text-3xl font-black uppercase italic text-center mb-12">
            What <span className="text-accent underline decoration-4 underline-offset-4">Developers</span> Are Saying
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                viewport={{ once: true }}
                className={`p-6 brutal-border brutal-shadow ${t.color} flex flex-col justify-between min-h-[180px] relative group cursor-default`}
              >
                <Quote className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity" size={40} />
                <p className="text-lg font-black leading-tight mb-6">"{t.text}"</p>
                <div>
                  <div className="font-black uppercase text-sm">{t.name}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                    <Twitter size={10} /> {t.handle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Infinite Marquee Tech Stack */}
        <div className="w-full bg-foreground py-6 overflow-hidden relative border-y-4 border-foreground">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              }
            }}
            className="flex gap-12 whitespace-nowrap min-w-full"
          >
            {[...techStack, ...techStack, ...techStack].map((tech, i) => (
              <span key={i} className="text-3xl md:text-5xl font-black uppercase italic text-background tracking-tighter">
                {tech} <span className="text-accent ml-8">///</span>
              </span>
            ))}
          </motion.div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
