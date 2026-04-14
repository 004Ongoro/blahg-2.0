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
        <div className="brutal-border brutal-shadow-lg bg-card p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="text-accent">{'>'}</span> initial setup
          </h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            create your admin account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full brutal-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="brutal-btn bg-accent text-accent-foreground py-3 font-bold disabled:opacity-50"
            >
              {loading ? 'creating account...' : 'create admin account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-muted-foreground hover:text-accent text-sm">
              &larr; back to blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
