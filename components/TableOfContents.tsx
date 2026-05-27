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
      <div 
        className={cn(
          "hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-end py-4 pr-0 transition-all duration-300",
          isDesktopOpen ? "bg-background/40 backdrop-blur-md p-6 shadow-sm border-l border-foreground/5" : ""
        )}
      >
        <div 
          className="flex flex-col items-end gap-4 border-r border-foreground/5 pr-4 pl-8"
          onMouseEnter={() => setIsDesktopOpen(true)}
          onMouseLeave={() => setIsDesktopOpen(false)}
        >
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollTo(heading.id)}
              className="relative flex items-center justify-end group/item"
            >
              <span
                className={cn(
                  "mr-4 text-[10px] uppercase font-bold tracking-widest transition-all duration-300 whitespace-nowrap",
                  isDesktopOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none",
                  activeId === heading.id ? "text-accent" : "text-muted-foreground/60"
                )}
              >
                {heading.text}
              </span>
              
              <div 
                className={cn(
                  "h-px transition-all duration-500",
                  activeId === heading.id 
                    ? "bg-accent w-8" 
                    : "bg-foreground/10 w-4 group-hover/item:w-6 group-hover/item:bg-foreground/30",
                  heading.level === 3 && "w-2 opacity-50"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
