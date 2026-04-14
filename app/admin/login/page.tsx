'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="brutal-border brutal-shadow-lg bg-card p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="text-accent">{'>'}</span> admin login
          </h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            enter your credentials
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
              {loading ? 'logging in...' : 'login'}
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
