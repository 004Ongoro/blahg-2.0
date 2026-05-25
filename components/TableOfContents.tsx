'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Find all headings within the prose-brutal container after a short delay
    // to ensure MarkdownContent has rendered
    const timer = setTimeout(() => {
      const articleElement = document.querySelector('.prose-brutal')
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

  return (
    <div 
      className={cn(
        "fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end py-4 group pr-2 transition-all duration-300",
        isOpen ? "bg-background/80 backdrop-blur-sm border-l-4 border-foreground p-4 -mr-0 shadow-[-8px_0_0_0_rgba(0,0,0,1)]" : ""
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col items-end gap-2 border-r-2 border-foreground/10 pr-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className="relative flex items-center justify-end group/item"
            onClick={(e) => {
              if (!isOpen && window.innerWidth < 768) {
                e.preventDefault()
                // Just let the container's onClick handle it
                return
              }
              e.preventDefault()
              e.stopPropagation() // Prevent container toggle when clicking actual link
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth'
              })
              if (window.innerWidth < 768) setIsOpen(false)
            }}
          >
            <span
              className={cn(
                "mr-4 text-[10px] uppercase tracking-tighter font-bold whitespace-nowrap px-2 py-1 bg-background border-2 brutal-border brutal-shadow-sm max-w-[200px] truncate transition-all duration-200 opacity-0 translate-x-4 pointer-events-none",
                (isOpen || "group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto"),
                isOpen && "opacity-100 translate-x-0 pointer-events-auto",
                activeId === heading.id ? "bg-accent text-white" : "text-foreground"
              )}
            >
              {heading.text}
            </span>
            
            <div 
              className={cn(
                "h-px transition-all duration-300 bg-foreground",
                activeId === heading.id 
                  ? "bg-accent w-6 h-[2px]" 
                  : "w-3 group-hover/item:w-4",
                heading.level === 1 && "w-4 group-hover/item:w-5",
                heading.level === 2 && "w-3 group-hover/item:w-4",
                heading.level === 3 && "w-2 group-hover/item:w-3 opacity-70",
                isOpen && "w-4"
              )}
            />
          </a>
        ))}
      </div>
      
      {/* Mobile hint */}
      <div className="md:hidden mt-2 text-[8px] font-black uppercase text-foreground/50">
        {isOpen ? 'Click to close' : 'Click to explore'}
      </div>
    </div>
  )
}
