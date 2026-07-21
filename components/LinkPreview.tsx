'use client'

import { useEffect, useState, useRef } from 'react'
import { ExternalLink, Globe, FileText, ArrowUpRight } from 'lucide-react'

interface PreviewData {
  url: string
  title?: string
  description?: string
  image?: string
  icon?: string
  siteName?: string
  isInternal: boolean
  loading: boolean
  error?: boolean
}

// In-memory cache for fast lookups during single page lifecycle
const memoryCache = new Map<string, PreviewData>()

function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return urlStr
  }
}

function isInternalUrl(urlStr: string): boolean {
  if (urlStr.startsWith('/') || urlStr.startsWith('#') || urlStr.startsWith('.')) {
    return true
  }
  try {
    const url = new URL(urlStr, window.location.origin)
    return (
      url.hostname === window.location.hostname ||
      url.hostname === 'code.geohack.top' ||
      url.hostname === 'localhost'
    )
  } catch {
    return false
  }
}

export function LinkPreview() {
  const [activeLink, setActiveLink] = useState<{
    href: string
    text: string
    rect: DOMRect
  } | null>(null)

  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    placeAbove: true,
  })

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringCardRef = useRef(false)
  const currentHrefRef = useRef<string | null>(null)

  // Fetch preview data without calling serverless endpoints
  const fetchPreviewData = async (href: string) => {
    // 1. Check in-memory cache
    if (memoryCache.has(href)) {
      setPreviewData(memoryCache.get(href)!)
      return
    }

    // 2. Check sessionStorage cache
    try {
      const stored = sessionStorage.getItem(`lp_cache_${href}`)
      if (stored) {
        const parsed = JSON.parse(stored) as PreviewData
        memoryCache.set(href, parsed)
        setPreviewData(parsed)
        return
      }
    } catch {
      // Ignore storage errors
    }

    const internal = isInternalUrl(href)
    const initialData: PreviewData = {
      url: href,
      isInternal: internal,
      loading: true,
    }

    setPreviewData(initialData)

    if (internal) {
      // For internal links: Direct browser fetch of static HTML (bypasses serverless functions!)
      try {
        const targetUrl = new URL(href, window.location.origin).toString()
        const res = await fetch(targetUrl, { headers: { Accept: 'text/html' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const html = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const title =
          doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
          doc.querySelector('h1')?.textContent?.trim() ||
          doc.querySelector('title')?.textContent?.trim() ||
          href

        const description =
          doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
          doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
          doc.querySelector('p')?.textContent?.trim() ||
          ''

        let image =
          doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined

        if (image && !image.startsWith('http')) {
          image = new URL(image, window.location.origin).toString()
        }

        const result: PreviewData = {
          url: href,
          title,
          description: description.length > 140 ? `${description.slice(0, 140)}...` : description,
          image,
          icon: '/favicon.ico',
          siteName: 'Blog Article',
          isInternal: true,
          loading: false,
        }

        memoryCache.set(href, result)
        try {
          sessionStorage.setItem(`lp_cache_${href}`, JSON.stringify(result))
        } catch {}

        if (currentHrefRef.current === href) {
          setPreviewData(result)
        }
      } catch (e) {
        const fallback: PreviewData = {
          url: href,
          title: href.replace(/^\//, ''),
          description: 'Internal post preview unavailable',
          siteName: 'Blog Article',
          isInternal: true,
          loading: false,
          error: true,
        }
        memoryCache.set(href, fallback)
        if (currentHrefRef.current === href) {
          setPreviewData(fallback)
        }
      }
    } else {
      // For external links: Client-side fetch to Microlink API directly from browser
      const domain = getDomain(href)
      const fallbackIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3500)

        const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(href)}`, {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Microlink request failed')
        const json = await res.json()

        if (json.status === 'success' && json.data) {
          const data = json.data
          const result: PreviewData = {
            url: href,
            title: data.title || domain,
            description:
              data.description && data.description.length > 140
                ? `${data.description.slice(0, 140)}...`
                : data.description,
            image: data.image?.url,
            icon: data.logo?.url || data.icon?.url || fallbackIcon,
            siteName: data.publisher || domain,
            isInternal: false,
            loading: false,
          }

          memoryCache.set(href, result)
          try {
            sessionStorage.setItem(`lp_cache_${href}`, JSON.stringify(result))
          } catch {}

          if (currentHrefRef.current === href) {
            setPreviewData(result)
          }
          return
        }
        throw new Error('No microlink metadata')
      } catch (e) {
        // High quality fallback using domain name and google favicon
        const result: PreviewData = {
          url: href,
          title: domain,
          description: `External link to ${domain}`,
          icon: fallbackIcon,
          siteName: domain,
          isInternal: false,
          loading: false,
        }
        memoryCache.set(href, result)
        if (currentHrefRef.current === href) {
          setPreviewData(result)
        }
      }
    }
  }

  // Calculate coordinates relative to viewport
  const updateCardPosition = (rect: DOMRect) => {
    const cardWidth = 320
    const cardEstimatedHeight = 180
    const gap = 10

    let left = rect.left + rect.width / 2 - cardWidth / 2
    // Constrain within screen bounds
    left = Math.max(16, Math.min(left, window.innerWidth - cardWidth - 16))

    const spaceAbove = rect.top
    const placeAbove = spaceAbove >= cardEstimatedHeight + gap

    const top = placeAbove
      ? rect.top - gap
      : rect.bottom + gap

    setPosition({ top, left, placeAbove })
  }

  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a') as HTMLAnchorElement | null

      if (!anchor || !anchor.closest('.prose-brutal')) return
      
      const href = anchor.getAttribute('href')
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.classList.contains('copy-btn') ||
        anchor.classList.contains('no-preview')
      ) {
        return
      }

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current)
        dismissTimerRef.current = null
      }

      const rect = anchor.getBoundingClientRect()
      currentHrefRef.current = href

      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)

      // Debounce hover by 250ms to prevent accidental triggers while moving cursor
      hoverTimerRef.current = setTimeout(() => {
        setActiveLink({ href, text: anchor.textContent || '', rect })
        updateCardPosition(rect)
        setIsVisible(true)
        fetchPreviewData(href)
      }, 250)
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor || !anchor.closest('.prose-brutal')) return

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }

      // Small delay so user can move cursor onto the popover card if needed
      dismissTimerRef.current = setTimeout(() => {
        if (!isHoveringCardRef.current) {
          setIsVisible(false)
          setActiveLink(null)
          currentHrefRef.current = null
        }
      }, 200)
    }

    const handleScrollOrResize = () => {
      if (isVisible) {
        setIsVisible(false)
        setActiveLink(null)
        currentHrefRef.current = null
      }
    }

    document.addEventListener('mouseover', handleMouseEnter, true)
    document.addEventListener('mouseout', handleMouseLeave, true)
    window.addEventListener('scroll', handleScrollOrResize, { passive: true })
    window.addEventListener('resize', handleScrollOrResize, { passive: true })

    return () => {
      document.removeEventListener('mouseover', handleMouseEnter, true)
      document.removeEventListener('mouseout', handleMouseLeave, true)
      window.removeEventListener('scroll', handleScrollOrResize)
      window.removeEventListener('resize', handleScrollOrResize)
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [isVisible])

  if (!isVisible || !activeLink) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: position.placeAbove ? 'translateY(-100%)' : 'translateY(0)',
      }}
      className="z-50 w-80 animate-in fade-in-0 zoom-in-95 duration-150 pointer-events-auto"
      onMouseEnter={() => {
        isHoveringCardRef.current = true
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current)
          dismissTimerRef.current = null
        }
      }}
      onMouseLeave={() => {
        isHoveringCardRef.current = false
        dismissTimerRef.current = setTimeout(() => {
          setIsVisible(false)
          setActiveLink(null)
          currentHrefRef.current = null
        }, 150)
      }}
    >
      <div className="overflow-hidden rounded-xl border-2 border-foreground/20 bg-background/95 backdrop-blur-md p-3.5 shadow-xl transition-all dark:border-border dark:bg-card/95">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-foreground/10 dark:border-white/10">
          <div className="flex items-center gap-1.5 min-w-0">
            {previewData?.icon ? (
              <img
                src={previewData.icon}
                alt=""
                className="w-4 h-4 rounded-xs shrink-0 object-contain"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
            ) : (
              <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              {previewData?.siteName || getDomain(activeLink.href)}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-accent/15 text-accent border border-accent/20">
            {previewData?.isInternal ? (
              <>
                <FileText className="w-2.5 h-2.5" /> Post
              </>
            ) : (
              <>
                <ExternalLink className="w-2.5 h-2.5" /> External
              </>
            )}
          </span>
        </div>

        {/* Loading state */}
        {previewData?.loading ? (
          <div className="space-y-2 py-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-full animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-foreground/10" />
          </div>
        ) : (
          /* Content state */
          <div className="space-y-2">
            {previewData?.image && (
              <div className="relative w-full h-28 overflow-hidden rounded-lg border border-foreground/10 dark:border-white/10">
                <img
                  src={previewData.image}
                  alt={previewData.title || ''}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLElement).parentElement!.style.display = 'none'
                  }}
                />
              </div>
            )}

            <div>
              <h4 className="text-xs font-black uppercase tracking-tight text-foreground line-clamp-2 leading-snug flex items-center gap-1">
                {previewData?.title || activeLink.text || activeLink.href}
                <ArrowUpRight className="w-3 h-3 text-accent shrink-0 inline" />
              </h4>

              {previewData?.description && (
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-1 font-medium">
                  {previewData.description}
                </p>
              )}
            </div>

            <div className="pt-1 text-[9px] text-muted-foreground font-mono truncate">
              {activeLink.href}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
