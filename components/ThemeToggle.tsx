'use client'

import * as React from 'react'
import { Moon, Sun, Trophy } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('spain')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4 text-indigo-400" />
      case 'spain':
        return <Trophy className="h-4 w-4 text-amber-400 animate-pulse" />
      default:
        return <Sun className="h-4 w-4 text-amber-500" />
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case 'dark':
        return 'Current: Dark Mode (Click for Spain 2026 Champions)'
      case 'spain':
        return 'Current: Spain 🏆 World Cup Mode (Click for Light Mode)'
      default:
        return 'Current: Light Mode (Click for Dark Mode)'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full transition-all hover:bg-foreground/10 active:scale-95",
        "text-foreground",
        theme === 'spain' && "bg-amber-400/20 ring-1 ring-amber-400/50 shadow-[0_0_10px_rgba(255,196,0,0.3)]"
      )}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

