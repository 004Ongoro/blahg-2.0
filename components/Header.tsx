'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'
import { ChevronRight } from 'lucide-react'

const navLinks = [
  { name: 'posts', href: '/' },
  { name: 'about', href: '/about' },
  { name: 'tags', href: '/tags' },
  { name: 'archive', href: '/archive' },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pathPieces = pathname.split('/').filter(Boolean)
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div className="flex items-center gap-2 max-w-full">
        
        {/* Identity Pill */}
        <div className={cn(
          "pointer-events-auto h-10 px-4 flex items-center bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm transition-all duration-500",
          isScrolled ? "opacity-100 translate-y-0" : "opacity-100"
        )}>
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            George <span className="text-accent">Ongoro</span>
          </Link>
        </div>

        {/* Context & Navigation Pill */}
        <div className="pointer-events-auto group relative flex items-center h-10 bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm transition-all duration-300 hover:px-2">
          {/* Breadcrumb View (Default) */}
          <div className="flex items-center px-4 group-hover:hidden transition-all duration-300">
            <span className="text-[10px] font-bold text-muted-foreground/40">GO</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/20 mx-1" />
            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[80px] sm:max-w-[150px]">
              {pathPieces.length === 0 ? 'Home' : pathPieces[0]}
            </span>
            {pathPieces.length > 1 && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground/20 mx-1" />
                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[80px] hidden sm:inline">
                  {pathPieces[pathPieces.length - 1].replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          {/* Nav View (Hover) */}
          <div className="hidden group-hover:flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    isActive 
                      ? "bg-foreground text-background" 
                      : "hover:bg-foreground/5 text-muted-foreground/60 hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Utility Pill */}
        <div className="pointer-events-auto h-10 w-10 flex items-center justify-center bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm">
          <ThemeToggle />
        </div>

      </div>
    </header>
  )
}
