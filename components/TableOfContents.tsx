'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)

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
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end py-4 group pr-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-end gap-2 border-r-2 border-foreground/10 pr-1">
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
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={cn(
                    "mr-4 text-[10px] uppercase tracking-tighter font-bold whitespace-nowrap px-2 py-1 bg-background border-2 brutal-border brutal-shadow-sm max-w-[200px] truncate",
                    activeId === heading.id ? "bg-accent text-white" : "text-foreground"
                  )}
                >
                  {heading.text}
                </motion.span>
              )}
            </AnimatePresence>
            
            <div 
              className={cn(
                "h-px transition-all duration-300 bg-foreground",
                activeId === heading.id 
                  ? "bg-accent w-6 h-[2px]" 
                  : "w-3 group-hover/item:w-4",
                heading.level === 1 && "w-4 group-hover/item:w-5",
                heading.level === 2 && "w-3 group-hover/item:w-4",
                heading.level === 3 && "w-2 group-hover/item:w-3 opacity-70"
              )}
            />
          </a>
        ))}
      </div>
    </div>
  )
}
