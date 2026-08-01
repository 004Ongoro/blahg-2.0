'use client'

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  )
}

interface GooglePreferredSourceProps {
  className?: string
  variant?: string
}

export function GooglePreferredSource({ className = '' }: GooglePreferredSourceProps) {
  const domain = 'code.geohack.top'
  const followUrl = `https://news.google.com/search?q=site%3A${encodeURIComponent(domain)}`

  return (
    <a
      href={followUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-background/80 hover:bg-foreground/5 hover:border-foreground/20 text-foreground transition-all duration-200 text-xs font-bold shadow-xs cursor-pointer ${className}`}
      title="Add as preferred source on Google"
    >
      <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="font-mono text-[10px] uppercase tracking-wider">Follow on Google</span>
    </a>
  )
}
