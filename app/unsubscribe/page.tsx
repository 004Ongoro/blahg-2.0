'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const idParam = searchParams.get('id') || ''

  const [email, setEmail] = useState(emailParam)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setStatus('loading')

    const targetEmail = email.trim()
    if (!targetEmail && !idParam) {
      setErrorMsg('Please enter your email address.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, id: idParam }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
      } else {
        setErrorMsg(data.error || 'Failed to process unsubscribe request.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('A network error occurred. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="max-w-md w-full border border-border bg-card p-8 rounded-3xl shadow-sm text-center">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
        George Ongoro // Newsletter
      </div>
      
      <h1 className="text-2xl font-black mb-3 uppercase tracking-tight text-foreground">
        Unsubscribe
      </h1>

      {status === 'success' ? (
        <div className="py-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ✓
          </div>
          <p className="mb-3 font-bold text-lg text-foreground">You have been unsubscribed.</p>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            You will no longer receive newsletter dispatches. If this was a mistake, you can resubscribe anytime on the home page.
          </p>
          <Link
            href="/"
            className="w-full bg-primary text-primary-foreground py-3 px-6 font-bold inline-block rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm"
          >
            Return to Blog
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Are you sure you want to stop receiving newsletter dispatches? Confirm your email address below.
          </p>

          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-input bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />

            {status === 'error' && errorMsg && (
              <p className="text-xs font-medium text-destructive bg-destructive/10 p-2.5 rounded-lg text-left">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-destructive text-destructive-foreground py-3 px-6 font-bold rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              {status === 'loading' ? 'Processing...' : 'Confirm Unsubscribe'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
              Cancel & Return to Blog
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense fallback={<p className="text-sm font-medium text-muted-foreground">Loading...</p>}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  )
}