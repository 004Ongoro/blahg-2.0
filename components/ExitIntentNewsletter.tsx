'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, Mail, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const COOLDOWN_DAYS = 7
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000

export function ExitIntentNewsletter() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const hasTriggeredRef = useRef(false)
  const isEligibleRef = useRef(false)
  const deepScrollReachedRef = useRef(false)

  useEffect(() => {
    // Exclude admin, setup, newsletter, and unsubscribe pages
    if (
      !pathname ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/setup') ||
      pathname === '/newsletter' ||
      pathname === '/unsubscribe'
    ) {
      return
    }

    // Check if already subscribed
    try {
      const isSubscribed = localStorage.getItem('newsletter_subscribed') === 'true'
      if (isSubscribed) return

      const dismissedAt = localStorage.getItem('exit_newsletter_dismissed')
      if (dismissedAt) {
        const timeSinceDismiss = Date.now() - parseInt(dismissedAt, 10)
        if (timeSinceDismiss < COOLDOWN_MS) return
      }
    } catch {
      // Ignore localStorage errors (e.g. incognito)
    }

    // Delay activation by 6 seconds to prevent false triggers on initial page load
    const timer = setTimeout(() => {
      isEligibleRef.current = true
    }, 6000)

    // Desktop exit-intent: mouse moves out of viewport towards the top
    const handleMouseLeave = (e: MouseEvent) => {
      if (!isEligibleRef.current || hasTriggeredRef.current) return
      if (e.clientY <= 15) {
        hasTriggeredRef.current = true
        setIsOpen(true)
      }
    }

    // Mobile exit-intent: rapid scroll up after reaching >45% of page content
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      if (!isEligibleRef.current || hasTriggeredRef.current) return
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const scrollPercent = (window.scrollY / scrollHeight) * 100
      if (scrollPercent > 45) {
        deepScrollReachedRef.current = true
      }

      if (deepScrollReachedRef.current && window.scrollY < lastScrollY - 80 && scrollPercent < 25) {
        hasTriggeredRef.current = true
        setIsOpen(true)
      }
      lastScrollY = window.scrollY
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  const handleDismiss = () => {
    setIsOpen(false)
    try {
      localStorage.setItem('exit_newsletter_dismissed', String(Date.now()))
    } catch {
      // Ignore
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        try {
          localStorage.setItem('newsletter_subscribed', 'true')
        } catch {
          // Ignore
        }
        // Auto-close after 2.5s
        setTimeout(() => {
          setIsOpen(false)
        }, 2500)
      } else {
        setStatus('error')
        setErrorMessage(data?.error || 'Could not subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-label="Newsletter Subscription"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm w-auto sm:w-[380px] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/95 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
        {/* Subtle decorative background ambient glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 h-32 w-32 rounded-full bg-accent/15 blur-2xl pointer-events-none" />

        {/* Header: Badge & Dismiss */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={11} />
            <span>Before you go</span>
          </span>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss newsletter prompt"
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-foreground/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 space-y-1.5">
          <h4 className="text-base font-extrabold text-foreground tracking-tight font-sans">
            Stay ahead in tech & architecture
          </h4>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Get high-signal weekly dispatches on full-stack systems, clean code, and edge engineering. No spam.
          </p>
        </div>

        {/* Form or Success State */}
        <div className="relative z-10 mt-4">
          {status === 'success' ? (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>You're on the list! Check your inbox for confirmation.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  required
                  disabled={loading}
                  className="w-full bg-background text-foreground px-3.5 py-2.5 text-xs font-sans rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {status === 'error' && errorMessage && (
                <p className="text-[11px] text-destructive font-medium px-1">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-foreground text-background hover:opacity-90 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Join Free</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
