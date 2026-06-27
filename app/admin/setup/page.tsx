'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SetupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch('/api/auth/setup')
        const data = await res.json()
        
        if (!data.setupRequired) {
          router.push('/admin/login')
        }
      } catch {
        // Continue with setup
      } finally {
        setChecking(false)
      }
    }
    checkSetup()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/login')
      } else {
        setError(data.error || 'Setup failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">checking setup status...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-background/60 backdrop-blur-md border border-foreground/5 p-8 rounded-[32px] shadow-lg relative overflow-hidden">
          {/* Subtle accent glow in background */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          
          <h1 className="text-2xl font-black uppercase tracking-widest text-center mb-2">
            Initial <span className="text-accent italic">Setup</span>
          </h1>
          <p className="text-muted-foreground/60 text-center mb-8 text-[10px] font-black uppercase tracking-widest">
            Create your administrator account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-1">
                username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-mono"
                placeholder="username"
                required
                minLength={3}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-1">
                password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-mono"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-1">
                confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-[11px] font-bold text-center mt-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-foreground text-background hover:bg-foreground/90 transition-all font-black uppercase text-xs tracking-widest rounded-full disabled:opacity-50 active:scale-95 duration-100 flex items-center justify-center cursor-pointer mt-2"
            >
              {loading ? 'creating account...' : 'create admin account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-accent transition-colors inline-flex items-center gap-1">
              &larr; back to blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
