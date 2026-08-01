'use client'

import { useState } from 'react'
import { Star, Check, Copy, ExternalLink, Globe, Rss, Sparkles, Search } from 'lucide-react'
import { toast } from 'sonner'
import { getBaseUrl } from '@/lib/utils'

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
  variant?: 'card' | 'badge' | 'compact'
  className?: string
}

export function GooglePreferredSource({ variant = 'card', className = '' }: GooglePreferredSourceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const domain = 'code.geohack.top'
  const googleNewsUrl = `https://news.google.com/search?q=site%3A${encodeURIComponent(domain)}`
  const googleSearchUrl = `https://www.google.com/search?q=site%3A${encodeURIComponent(domain)}`
  const rssUrl = `/rss.xml`

  const handleCopySearchQuery = () => {
    const query = `site:${domain}`
    navigator.clipboard.writeText(query)
    setCopied(true)
    toast.success('Google search preference query copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  if (variant === 'badge') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-background/60 hover:bg-background/90 hover:border-accent/40 text-foreground transition-all duration-200 text-xs font-bold shadow-xs cursor-pointer ${className}`}
        title="Add as preferred source on Google"
      >
        <GoogleIcon className="h-3.5 w-3.5" />
        <span className="font-mono text-[10px] uppercase tracking-wider">Add to Google</span>
        <Star className="h-3 w-3 text-amber-500 fill-amber-500 animate-pulse" />
      </button>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`p-4 border border-foreground/10 bg-background/40 backdrop-blur-md rounded-2xl space-y-3 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-foreground/5 border border-foreground/5">
              <GoogleIcon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                Prefer on Google
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              </h4>
              <p className="text-[10px] text-muted-foreground font-mono">Prioritize blog posts in Google Search</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:text-accent-foreground rounded-full transition-all cursor-pointer"
          >
            Configure
          </button>
        </div>

        {isOpen && (
          <GoogleModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            googleNewsUrl={googleNewsUrl}
            googleSearchUrl={googleSearchUrl}
            rssUrl={rssUrl}
            handleCopySearchQuery={handleCopySearchQuery}
            copied={copied}
            domain={domain}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <div className={`p-6 border border-foreground/10 bg-background/60 backdrop-blur-xl rounded-[28px] shadow-sm relative overflow-hidden space-y-5 ${className}`}>
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center p-2 shrink-0 shadow-xs">
              <GoogleIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Preferred Source
              </span>
              <h3 className="text-sm font-black uppercase tracking-tight text-foreground">
                Add to Google Search & News
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold w-fit">
            <Star className="h-3 w-3 fill-amber-500" />
            <span>Google Preferred</span>
          </div>
        </div>

        <p className="text-xs font-medium leading-relaxed text-muted-foreground">
          Never miss technical posts from <strong className="text-foreground">{domain}</strong>. Add this blog as a preferred source in Google Search, Google News, and Chrome feeds so Google prioritizes our practical guides and articles in your personalized search results.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href={googleNewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background hover:bg-accent hover:text-accent-foreground rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <GoogleIcon className="h-3.5 w-3.5" />
            <span>Follow on Google News</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-accent" />
            <span>Setup Instructions</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <GoogleModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          googleNewsUrl={googleNewsUrl}
          googleSearchUrl={googleSearchUrl}
          rssUrl={rssUrl}
          handleCopySearchQuery={handleCopySearchQuery}
          copied={copied}
          domain={domain}
        />
      )}
    </>
  )
}

function GoogleModal({
  isOpen,
  onClose,
  googleNewsUrl,
  googleSearchUrl,
  rssUrl,
  handleCopySearchQuery,
  copied,
  domain,
}: {
  isOpen: boolean
  onClose: () => void
  googleNewsUrl: string
  googleSearchUrl: string
  rssUrl: string
  handleCopySearchQuery: () => void
  copied: boolean
  domain: string
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-background border border-foreground/10 rounded-[32px] p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-foreground/5 border border-foreground/10">
              <GoogleIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Google Integration</span>
              <h3 className="text-base font-black uppercase tracking-tight">Set as Preferred Source</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs font-medium leading-relaxed">
          {/* Method 1: Google News */}
          <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                <Globe className="h-3.5 w-3.5 text-accent" /> 1. Google News & Discover
              </h4>
              <span className="text-[9px] font-mono font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">Recommended</span>
            </div>
            <p className="text-muted-foreground">
              Open the Google News page for <strong>{domain}</strong> and click the <strong className="text-foreground">Star (★ Follow)</strong> button to receive automatic search indexing and Discover notifications.
            </p>
            <a
              href={googleNewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline pt-1"
            >
              Open in Google News <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Method 2: Google Search Shortcut */}
          <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-2">
            <h4 className="font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
              <Search className="h-3.5 w-3.5 text-accent" /> 2. Google Search Filter Query
            </h4>
            <p className="text-muted-foreground">
              Use the Google site filter query to force Google Search to show results exclusively or prioritized from this blog:
            </p>
            <div className="flex items-center gap-2 pt-1">
              <code className="flex-1 px-3 py-2 bg-background border border-foreground/10 rounded-xl font-mono text-[11px] text-foreground font-bold">
                site:{domain}
              </code>
              <button
                onClick={handleCopySearchQuery}
                className="px-3 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Method 3: RSS Feed for Google Reader & Chrome */}
          <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-2">
            <h4 className="font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
              <Rss className="h-3.5 w-3.5 text-accent" /> 3. RSS & Browser Follow
            </h4>
            <p className="text-muted-foreground">
              Chrome mobile and Google Feed support RSS auto-discovery. You can also subscribe directly in your preferred feed reader.
            </p>
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline pt-1"
            >
              Access RSS Feed XML <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-foreground text-background hover:bg-foreground/90 rounded-full font-black uppercase text-xs tracking-wider cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
