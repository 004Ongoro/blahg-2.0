'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrolled / maxHeight) * 100
      
      setProgress(scrollPercent)
      setIsVisible(scrolled > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-40 flex items-center justify-center transition-all duration-500 group",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      {/* Progress Ring */}
      <svg className="h-12 w-12 transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-foreground/5"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={125.6}
          strokeDashoffset={125.6 - (125.6 * progress) / 100}
          strokeLinecap="round"
          className="text-accent transition-all duration-100 ease-out"
        />
      </svg>

      {/* Arrow / Percentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ArrowUp className="h-4 w-4 text-foreground transition-transform group-hover:-translate-y-1" />
        
        {/* Subtle Percentage hover hint */}
        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-background/80 backdrop-blur-md border border-foreground/5 px-2 py-1 rounded-lg text-[10px] font-black tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
    </button>
  )
}
