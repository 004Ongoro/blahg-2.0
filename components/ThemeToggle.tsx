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

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 brutal-border brutal-shadow hover:-translate-y-0.5 transition-all bg-accent text-accent-foreground"
                title="Change Theme"
              >
                <Palette className="h-6 w-6" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            change theme
          </TooltipContent>
          <PopoverContent 
            align="end" 
            side="top" 
            sideOffset={12}
            className="w-40 p-2 brutal-border brutal-shadow bg-card"
          >
            <div className="flex flex-col gap-1">
              {themes.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 text-sm font-bold uppercase transition-colors",
                      theme === t.name 
                        ? "bg-foreground text-background" 
                        : "hover:bg-accent hover:text-accent-foreground text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </div>
  )
}
