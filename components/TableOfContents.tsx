'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, List, X, Layers } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  isSidebar?: boolean
}

export function TableOfContents({ content, isSidebar = false }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showFloatingBar, setShowFloatingBar] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const articleElement = document.querySelector('.prose-brutal, .prose')
      if (!articleElement) return

      const headingElements = articleElement.querySelectorAll('h1, h2, h3')
      const items: TOCItem[] = Array.from(headingElements)
        .map((el) => ({
          id: el.id,
          text: (el.querySelector('span') || el).textContent || '',
          level: parseInt(el.tagName.substring(1)),
        }))
        .filter((item) => item.id)

      setHeadings(items)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: '-10% 0% -80% 0%' }
      )

      headingElements.forEach((el) => {
        if (el.id) observer.observe(el)
      })

      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timer)
  }, [content])

  // Track scroll position to show/hide mobile floating bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Show floating bar after scrolling 250px down
      setShowFloatingBar(scrollY > 250)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (headings.length === 0) return null

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for fixed HUD
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const activeIndex = headings.findIndex((h) => h.id === activeId)
  const activeHeading = activeIndex !== -1 ? headings[activeIndex] : headings[0]
  const activeTitle = activeHeading ? activeHeading.text : 'Table of Contents'

  // Desktop Sidebar Version
  if (isSidebar) {
    return (
      <nav className="flex flex-col gap-3 font-sans text-xs">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollTo(heading.id)}
            className={cn(
              'text-left font-semibold transition-all hover:text-accent duration-200 border-l pl-3 py-1 -ml-px',
              activeId === heading.id
                ? 'border-accent text-accent font-bold'
                : 'border-foreground/10 text-muted-foreground/70 hover:border-foreground/30',
              heading.level === 3 && 'text-[11px] ml-3'
            )}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    )
  }

  // Mobile & Tablet Version
  return (
    <>
      {/* 1. Inline Top Card (Static near header) */}
      <div className="lg:hidden mb-8">
        <div className="bg-foreground/[0.02] border border-foreground/10 dark:border-white/10 rounded-2xl overflow-hidden transition-all">
          <button
            onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
            className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex items-center gap-2 truncate pr-2">
              <List size={14} className="text-accent shrink-0" />
              <span className="truncate">{activeTitle}</span>
            </span>
            <ChevronDown
              size={14}
              className={cn('transition-transform duration-300 shrink-0', !isMobileCollapsed && 'rotate-180')}
            />
          </button>

          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isMobileCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 p-4 pt-0'
            )}
          >
            <div className="h-px bg-foreground/10 mb-4" />
            <nav className="flex flex-col gap-3">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => {
                    scrollTo(heading.id)
                    setIsMobileCollapsed(true)
                  }}
                  className={cn(
                    'text-left text-sm font-bold transition-colors hover:text-accent',
                    activeId === heading.id ? 'text-accent font-black' : 'text-muted-foreground',
                    heading.level === 2 ? 'pl-0' : 'pl-4 text-xs opacity-80'
                  )}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 2. Floating Active Section Button (Fixed at Bottom on Mobile when scrolling) */}
      {showFloatingBar && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/90 backdrop-blur-md border border-foreground/20 dark:border-white/20 text-foreground shadow-xl active:scale-95 transition-all max-w-[88vw]"
            aria-label="Open Table of Contents"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>

            <span className="text-xs font-black uppercase tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
              {activeTitle}
            </span>

            <span className="flex items-center gap-1 pl-1 border-l border-foreground/15 text-[10px] font-bold text-muted-foreground shrink-0">
              <span>{activeIndex !== -1 ? `${activeIndex + 1}/${headings.length}` : ''}</span>
              <ChevronUp size={14} className="text-accent" />
            </span>
          </button>
        </div>
      )}

      {/* 3. Mobile Bottom Drawer / Sheet */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 pointer-events-auto">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
          />

          {/* Bottom Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] bg-background/95 backdrop-blur-2xl border-t-2 border-foreground/20 dark:border-white/20 rounded-t-3xl p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-foreground/10">
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground truncate">
                  Article Outline ({headings.length})
                </span>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Active Section Banner */}
            <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <span className="text-[10px] font-black uppercase tracking-wider text-accent block mb-0.5">
                Currently Reading
              </span>
              <p className="text-sm font-black text-foreground truncate">
                {activeTitle}
              </p>
            </div>

            {/* Heading List */}
            <nav className="flex flex-col gap-2 overflow-y-auto py-2">
              {headings.map((heading, idx) => {
                const isActive = activeId === heading.id
                return (
                  <button
                    key={heading.id}
                    onClick={() => {
                      scrollTo(heading.id)
                      setIsDrawerOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between text-left p-2.5 rounded-xl font-bold transition-all',
                      isActive
                        ? 'bg-accent/15 text-accent border border-accent/30 font-black'
                        : 'hover:bg-foreground/5 text-muted-foreground hover:text-foreground',
                      heading.level === 3 && 'ml-3 text-xs'
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono opacity-50 shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{heading.text}</span>
                    </span>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0 ml-2 animate-pulse" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
