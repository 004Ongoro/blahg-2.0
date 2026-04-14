import Link from 'next/link'

export function Header() {
  return (
    <header className="brutal-border border-b-3 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="group">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-accent">{'>'}</span>
            <span className="text-foreground">dev</span>
            <span className="text-muted-foreground">.blog</span>
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm hover:text-accent transition-colors"
          >
            /posts
          </Link>
          <Link
            href="/tags"
            className="text-sm hover:text-accent transition-colors"
          >
            /tags
          </Link>
          <Link
            href="/admin"
            className="brutal-btn bg-accent text-accent-foreground px-3 py-1 text-sm font-bold"
          >
            /admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
