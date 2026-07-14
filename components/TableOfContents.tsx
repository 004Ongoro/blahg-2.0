'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, List } from 'lucide-react'

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

  // Desktop Sidebar Version
  if (isSidebar) {
    return (
      <nav className="flex flex-col gap-3 font-sans text-xs">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollTo(heading.id)}
            className={cn(
              "text-left font-semibold transition-all hover:text-accent duration-200 border-l pl-3 py-1 -ml-px",
              activeId === heading.id 
                ? "border-accent text-accent font-bold" 
                : "border-foreground/10 text-muted-foreground/70 hover:border-foreground/30",
              heading.level === 3 && "text-[11px] ml-3"
            )}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    )
  }

  // Mobile/Tablet Inline Version
  return (
    <div className="lg:hidden mb-8">
      <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden transition-all">
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
  )
}
