'use client'

import { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'You’re subscribed! Check your inbox for confirmation.',
        })
        toast.success('Successfully subscribed to dispatches!')
        try {
          localStorage.setItem('newsletter_subscribed', 'true')
        } catch {}
        setEmail('')
      } else {
        const errorMsg = data.error || 'Something went wrong. Please check your email and try again.'
        setStatus({ type: 'error', message: errorMsg })
        toast.error(errorMsg)
      }
    } catch {
      const errorMsg = 'Failed to connect. Please check your internet connection and try again.'
      setStatus({ type: 'error', message: errorMsg })
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-xs"
    >
      {/* Decorative ambient background blur */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-64 h-64 bg-accent/10 -mr-24 -mt-24 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-xl space-y-4">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono font-bold uppercase tracking-wider">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Newsletter</span>
        </div>

        {/* Title */}
        <h2
          id="newsletter-heading"
          className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-foreground"
        >
          Your Next Coding Idea <span className="text-accent">Starts Here.</span>
        </h2>

        {/* Description & Value Proposition */}
        <p
          id="newsletter-description"
          className="text-sm md:text-base leading-relaxed text-muted-foreground font-sans"
        >
          From hands-on tutorials to open-source discoveries and side-project deep dives, get fresh ideas to learn, build, and experiment with.
        </p>

        {/* Success Feedback View */}
        {status?.type === 'success' ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-foreground space-y-2 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2.5 text-green-600 dark:text-green-400 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{status.message}</span>
            </div>
            <p className="text-xs text-muted-foreground pl-7">
              Keep an eye out for upcoming dispatches on full-stack development and open source projects.
            </p>
            <div className="pl-7 pt-1">
              <button
                type="button"
                onClick={() => setStatus(null)}
                className="text-xs text-accent hover:underline font-mono uppercase tracking-wider font-bold"
              >
                Subscribe another email →
              </button>
            </div>
          </div>
        ) : (
          /* Accessible, High-Converting Form */
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="newsletter-description"
            className="space-y-3 pt-1"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status?.type === 'error') setStatus(null)
                  }}
                  placeholder="you@domain.com"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  required
                  aria-required="true"
                  aria-invalid={status?.type === 'error' ? true : undefined}
                  aria-errormessage={status?.type === 'error' ? 'newsletter-error-message' : undefined}
                  disabled={loading}
                  className="w-full bg-background text-foreground px-4 py-3 text-sm font-sans rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-muted-foreground/60 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                aria-busy={loading}
                className="bg-accent text-accent-foreground px-6 py-3 font-mono font-bold uppercase tracking-wider text-xs hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Join Free</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>

            {/* Inline Accessible Error Message */}
            {status?.type === 'error' && (
              <div
                id="newsletter-error-message"
                role="alert"
                aria-live="assertive"
                className="flex items-center gap-2 text-xs font-semibold text-destructive pt-1"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{status.message}</span>
              </div>
            )}
          </form>
        )}

        {/* Friction Reducers & Trust Signals */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span>High signal, ~1-2/month</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span>No spam ever</span>
          </span>
          <span className="text-muted-foreground/80">
            Unsubscribe anytime with 1 click
          </span>
        </div>
      </div>
    </section>
  )
}
