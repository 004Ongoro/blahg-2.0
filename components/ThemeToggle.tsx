'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
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
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getThemeIcon = () => {
    if (theme === 'dark') {
      return <Moon className="h-4 w-4 text-indigo-400" />
    }
    return <Sun className="h-4 w-4 text-amber-500" />
  }

  const getTooltip = () => {
    return theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full transition-all hover:bg-foreground/10 active:scale-95 text-foreground"
      )}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
