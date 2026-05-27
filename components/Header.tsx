'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'
import { ChevronRight, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'posts', href: '/' },
  { name: 'about', href: '/about' },
  { name: 'tags', href: '/tags' },
  { name: 'archive', href: '/archive' },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const pathPieces = pathname.split('/').filter(Boolean)
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      {/* Desktop HUD */}
      <div className="hidden md:flex items-center gap-2 max-w-full">
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
          <div className="flex items-center px-4 group-hover:hidden transition-all duration-300">
            <span className="text-[10px] font-bold text-muted-foreground/40">GO</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/20 mx-1" />
            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">
              {pathPieces.length === 0 ? 'Home' : pathPieces[0]}
            </span>
            {pathPieces.length > 1 && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground/20 mx-1" />
                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[80px]">
                  {pathPieces[pathPieces.length - 1].replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

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

      {/* Mobile HUD */}
      <div className="md:hidden w-full flex flex-col items-center pointer-events-none">
        <div className={cn(
          "pointer-events-auto relative flex flex-col items-center bg-background/80 backdrop-blur-lg border border-foreground/5 shadow-lg transition-all duration-500 overflow-hidden",
          isMobileMenuOpen ? "rounded-3xl w-full max-w-[280px]" : "rounded-full w-[200px]"
        )}>
          {/* Main Bar */}
          <div className="flex items-center justify-between w-full h-11 px-4">
            <Link href="/" className="text-[9px] font-black uppercase tracking-tighter truncate max-w-[80px]">
              {isMobileMenuOpen ? "George" : (pathPieces[0] || "Home")}
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/5 text-foreground transition-transform active:scale-90"
            >
              {isMobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>

            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Expanded Menu */}
          <div className={cn(
            "w-full flex flex-col items-center gap-2 transition-all duration-300",
            isMobileMenuOpen ? "p-4 pt-0 max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}>
            <div className="w-full h-px bg-foreground/5 mb-2" />
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "w-full py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-foreground/5 text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
