'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, ArrowRight, ShieldCheck } from 'lucide-react'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Small delay for smooth entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-[70] max-w-md w-full bg-background/95 backdrop-blur-md border border-foreground/15 p-5 rounded-2xl shadow-2xl font-mono text-xs animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-accent/10 text-accent shrink-0 mt-0.5">
          <Cookie size={16} />
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-accent" /> Privacy & Cookies
            </span>
            <button
              onClick={handleDecline}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
              title="Dismiss"
              aria-label="Dismiss cookie notice"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-muted-foreground leading-relaxed font-medium">
            We use cookies & Google Analytics to analyze traffic, and collect email addresses for newsletter broadcasts.
          </p>

          <div className="flex items-center justify-between gap-3 pt-1">
            <Link
              href="/privacy"
              className="text-[10px] font-bold uppercase tracking-wider text-accent hover:underline inline-flex items-center gap-1"
            >
              Learn more <ArrowRight size={10} />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDecline}
                className="px-3 py-1.5 rounded-full border border-foreground/10 hover:border-foreground/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
