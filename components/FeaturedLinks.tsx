'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, FileText, ArrowUpRight, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react'

export interface FeaturedLinkItem {
  url: string
  text: string
  domain: string
  isInternal: boolean
  icon: string
  title?: string
  description?: string
  image?: string
}

interface FeaturedLinksProps {
  content: string
  isSidebar?: boolean
  isMobileAccordion?: boolean
}

function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr, typeof window !== 'undefined' ? window.location.origin : 'https://code.geohack.top')
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return 'link'
  }
}

function isInternalUrl(urlStr: string): boolean {
  if (urlStr.startsWith('/') || urlStr.startsWith('#') || urlStr.startsWith('.')) {
    return true
  }
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://code.geohack.top'
    const url = new URL(urlStr, origin)
    return (
      url.hostname === 'code.geohack.top' ||
      url.hostname === 'localhost' ||
      (typeof window !== 'undefined' && url.hostname === window.location.hostname)
    )
  } catch {
    return false
  }
}

function cleanUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr)
    const keysToRemove: string[] = []
    url.searchParams.forEach((_, key) => {
      if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid' || key === 'ref') {
        keysToRemove.push(key)
      }
    })
    keysToRemove.forEach((k) => url.searchParams.delete(k))
    url.hash = ''
    return url.toString()
  } catch {
    return urlStr
  }
}

export function extractFeaturedLinks(content: string): FeaturedLinkItem[] {
  if (!content) return []

  const links: FeaturedLinkItem[] = []
  const seenUrls = new Set<string>()

  // Markdown links: [Text](url)
  const mdRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  // HTML links: <a href="url">Text</a>
  const htmlRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi

  let match: RegExpExecArray | null

  while ((match = mdRegex.exec(content)) !== null) {
    const text = match[1]?.trim()
    const rawUrl = match[2]?.trim()
    if (!rawUrl || !text) continue

    if (
      rawUrl.startsWith('#') ||
      rawUrl.startsWith('javascript:') ||
      rawUrl.startsWith('mailto:') ||
      rawUrl.startsWith('tel:')
    ) {
      continue
    }

    const cUrl = cleanUrl(rawUrl)
    if (seenUrls.has(cUrl)) continue
    seenUrls.add(cUrl)

    const internal = isInternalUrl(rawUrl)
    const domain = getDomain(rawUrl)
    const icon = internal
      ? '/favicon.ico'
      : `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

    links.push({
      url: rawUrl,
      text,
      domain,
      isInternal: internal,
      icon,
    })
  }

  while ((match = htmlRegex.exec(content)) !== null) {
    const rawUrl = match[1]?.trim()
    const text = match[2]?.replace(/<[^>]+>/g, '')?.trim()
    if (!rawUrl || !text) continue

    if (
      rawUrl.startsWith('#') ||
      rawUrl.startsWith('javascript:') ||
      rawUrl.startsWith('mailto:') ||
      rawUrl.startsWith('tel:')
    ) {
      continue
    }

    const cUrl = cleanUrl(rawUrl)
    if (seenUrls.has(cUrl)) continue
    seenUrls.add(cUrl)

    const internal = isInternalUrl(rawUrl)
    const domain = getDomain(rawUrl)
    const icon = internal
      ? '/favicon.ico'
      : `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

    links.push({
      url: rawUrl,
      text,
      domain,
      isInternal: internal,
      icon,
    })
  }

  // Prioritize internal post links first, then external reference links
  return links.sort((a, b) => (b.isInternal ? 1 : 0) - (a.isInternal ? 1 : 0)).slice(0, 6)
}

export function FeaturedLinks({ content, isSidebar, isMobileAccordion }: FeaturedLinksProps) {
  const initialLinks = useMemo(() => extractFeaturedLinks(content), [content])
  const [links, setLinks] = useState<FeaturedLinkItem[]>(initialLinks)
  const [isExpanded, setIsExpanded] = useState(false)

  // Asynchronously fetch subtle preview images/titles client-side without server endpoints
  useEffect(() => {
    if (initialLinks.length === 0) return

    let isMounted = true

    const fetchSubtlePreviews = async () => {
      const updated = await Promise.all(
        initialLinks.map(async (item) => {
          if (item.isInternal) return item
          try {
            // Check sessionStorage cache first
            const stored = sessionStorage.getItem(`lp_cache_${cleanUrl(item.url)}`)
            if (stored) {
              const parsed = JSON.parse(stored)
              return {
                ...item,
                title: parsed.title || item.text,
                image: parsed.image,
                icon: parsed.icon || item.icon,
                domain: parsed.siteName || item.domain,
              }
            }

            // Quick client fetch via oEmbed for YouTube
            const clean = cleanUrl(item.url)
            if (clean.includes('youtube.com/watch') || clean.includes('youtu.be/')) {
              const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(clean)}&format=json`)
              if (res.ok) {
                const data = await res.json()
                return {
                  ...item,
                  title: data.title || item.text,
                  image: data.thumbnail_url,
                  domain: 'YouTube',
                }
              }
            }
          } catch {}
          return item
        })
      )

      if (isMounted) {
        setLinks(updated)
      }
    }

    fetchSubtlePreviews()
    return () => {
      isMounted = false
    }
  }, [initialLinks])

  if (!links || links.length === 0) return null

  // Subtle Small Preview Card Component
  const renderCard = (item: FeaturedLinkItem, index: number) => {
    const isInternal = item.isInternal
    const href = item.url

    return (
      <a
        key={`${item.url}-${index}`}
        href={href}
        target={isInternal ? '_self' : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
        className="group relative flex items-center gap-3 p-2.5 rounded-xl border border-foreground/10 dark:border-white/10 bg-background/60 hover:bg-accent/5 hover:border-accent/40 transition-all duration-200 shadow-2xs hover:shadow-xs pointer-events-auto"
      >
        {/* Small Preview Thumbnail / Icon */}
        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-muted/30 border border-foreground/5 shrink-0 flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          ) : (
            <img
              src={item.icon}
              alt=""
              className="w-4 h-4 object-contain"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          )}
        </div>

        {/* Content details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 truncate">
              {item.domain}
            </span>
            <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-accent/10 text-accent shrink-0">
              {isInternal ? 'Post' : 'Link'}
            </span>
          </div>
          <p className="text-xs font-bold text-foreground group-hover:text-accent transition-colors truncate leading-tight flex items-center gap-1">
            <span className="truncate">{item.title || item.text}</span>
            <ArrowUpRight className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </p>
        </div>
      </a>
    )
  }

  // Desktop Sticky Sidebar Render
  if (isSidebar) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/45 flex items-center gap-1.5">
            <LinkIcon className="w-3 h-3 text-accent" /> Featured Links
          </h3>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            {links.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {links.map((item, idx) => renderCard(item, idx))}
        </div>
      </div>
    )
  }

  // Mobile Accordion Render (at end of comments section)
  if (isMobileAccordion) {
    return (
      <div className="mt-12 border border-foreground/10 dark:border-white/10 rounded-2xl bg-card/40 overflow-hidden transition-all shadow-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left font-bold text-sm hover:bg-accent/5 transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
              <LinkIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-foreground">Featured Links in Article</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
              {links.length}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="p-4 pt-0 border-t border-foreground/5 animate-in fade-in-50 duration-200">
            <p className="text-[11px] text-muted-foreground mb-3 font-medium">
              Priority links and resources referenced in this blog post:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {links.map((item, idx) => renderCard(item, idx))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
