'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('subscribed! welcome to the chaos.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'something broke. try again.')
      }
    } catch {
      setStatus('error')
      setMessage('network error. are you online?')
    }
  }

  return (
    <section className="brutal-border brutal-shadow bg-secondary p-6">
      <h3 className="text-xl font-bold mb-2">
        <span className="text-accent">{'>'}</span> stay in the loop
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        get notified when i write something new. no spam, just code.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 brutal-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="brutal-btn bg-accent text-accent-foreground px-6 py-2 font-bold text-sm disabled:opacity-50"
        >
          {status === 'loading' ? 'sending...' : 'subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === 'success' ? 'text-green-600' : 'text-destructive'
          }`}
        >
          {message}
        </p>
      )}
    </section>
  )
}
