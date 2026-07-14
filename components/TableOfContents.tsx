'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, List } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const articleElement = document.querySelector('.prose-brutal, .prose')
      if (!articleElement) return

      const headingElements = articleElement.querySelectorAll('h1, h2, h3')
      const items: TOCItem[] = Array.from(headingElements).map((el) => ({
        id: el.id,
        text: (el.querySelector('span') || el).textContent || '',
        level: parseInt(el.tagName.substring(1))
      })).filter(item => item.id)

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
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Mobile Inline TOC */}
      <div className="md:hidden mb-8">
        <div className="bg-foreground/5 border border-foreground/5 rounded-2xl overflow-hidden transition-all">
          <button 
            onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
            className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <List size={14} className="text-accent" />
              In this post
            </span>
            <ChevronDown 
              size={14} 
              className={cn("transition-transform duration-300", !isMobileCollapsed && "rotate-180")} 
            />
          </button>
          
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            isMobileCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100 p-4 pt-0"
          )}>
            <div className="h-px bg-foreground/5 mb-4" />
            <nav className="flex flex-col gap-3">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => {
                    scrollTo(heading.id)
                    setIsMobileCollapsed(true)
                  }}
                  className={cn(
                    "text-left text-sm font-bold transition-colors hover:text-accent",
                    activeId === heading.id ? "text-accent" : "text-muted-foreground",
                    heading.level === 2 ? "pl-0" : "pl-4 text-xs opacity-80"
                  )}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Floating TOC */}
      <div className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
        {/* Toggle Pill Button */}
        <button 
          onClick={() => setIsDesktopOpen(!isDesktopOpen)}
          className={cn(
            "flex items-center justify-center w-10 h-10 brutal-border bg-card text-foreground hover:-translate-y-0.5 transition-all shadow-[2px_2px_0_var(--foreground)] active:translate-y-0 active:shadow-none",
            isDesktopOpen && "bg-accent text-accent-foreground"
          )}
          title="Table of Contents"
        >
          <List size={16} className={cn("transition-transform duration-300", isDesktopOpen && "rotate-90")} />
        </button>

        {/* Index Panel Card */}
        {isDesktopOpen && (
          <div 
            className="absolute right-14 top-1/2 -translate-y-1/2 brutal-border bg-card p-6 w-64 max-h-[70vh] overflow-y-auto shadow-[4px_4px_0_var(--foreground)] animate-in fade-in slide-in-from-right-4 duration-200"
          >
            <div className="flex items-center justify-between mb-4 border-b brutal-border border-x-0 border-t-0 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Index / Contents</span>
              <button 
                onClick={() => setIsDesktopOpen(false)}
                className="text-[9px] font-black uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
            
            <nav className="flex flex-col gap-3">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => {
                    scrollTo(heading.id)
                    setIsDesktopOpen(false) // Close panel on click
                  }}
                  className={cn(
                    "text-left text-xs font-bold transition-all hover:text-accent hover:translate-x-0.5 duration-200",
                    activeId === heading.id 
                      ? "text-accent pl-2 border-l-2 border-accent" 
                      : "text-muted-foreground/80 pl-0 border-l-0",
                    heading.level === 3 && "text-[11px] opacity-80 ml-3"
                  )}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
