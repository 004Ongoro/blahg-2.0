'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="brutal-border border-b-3 bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xl font-bold">
            <span className="text-accent">{'>'}</span>
            <span className="text-foreground">admin</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm hover:text-accent transition-colors"
            >
              /dashboard
            </Link>
            <Link
              href="/admin/new"
              className="text-sm hover:text-accent transition-colors"
            >
              /new
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            view blog &rarr;
          </Link>
          <button
            onClick={handleLogout}
            className="brutal-btn bg-background text-foreground px-3 py-1 text-sm font-bold"
          >
            logout
          </button>
        </div>
      </div>
    </header>
  )
}
