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
        "fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end py-4 group pr-4 transition-all duration-300",
        isOpen ? "bg-background/40 backdrop-blur-md p-6 -mr-0" : ""
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col items-end gap-4 border-r border-foreground/5 pr-4">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className="relative flex items-center justify-end group/item"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth'
              })
            }}
          >
            <span
              className={cn(
                "mr-4 text-[10px] uppercase font-bold tracking-widest transition-all duration-300",
                isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none",
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
          </a>
        ))}
      </div>
    </div>
  )
}
