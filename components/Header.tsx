'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'
import { ChevronRight, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'posts', href: '/' },
  { name: 'dispatches', href: '/newsletter/archive' },
  { name: 'bookmarks', href: '/bookmarks' },
  { name: 'setup', href: '/setup' },
  { name: 'about', href: '/about' },
  { name: 'tags', href: '/tags' },
  { name: 'archive', href: '/archive' },
  { name: 'guest logs', href: 'https://guest-blog.geohack.top' },
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 md:p-4 pointer-events-none">
      {/* Desktop Navigation HUD */}
      <div className="hidden md:flex items-center gap-3 max-w-full">
        {/* Brand & Identity Pill */}
        <div
          className={cn(
            "pointer-events-auto h-11 px-5 flex items-center bg-card/85 backdrop-blur-md border border-border rounded-full shadow-sm transition-all duration-300 hover:border-accent/40",
            isScrolled ? "shadow-md bg-card/95" : ""
          )}
        >
          <Link
            href="/"
            className="text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:text-accent transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full px-1"
          >
            <span>George</span>
            <span className="text-accent font-black">Ongoro</span>
          </Link>
        </div>

        {/* Dynamic Context & Hover Navigation Pill */}
        <div className="pointer-events-auto group relative flex items-center h-11 bg-card/85 backdrop-blur-md border border-border rounded-full shadow-sm transition-all duration-300 hover:border-accent/40">
          {/* Default Breadcrumb Context View */}
          <div className="flex items-center px-4 group-hover:hidden transition-all duration-300">
            <span className="text-xs font-mono font-bold text-muted-foreground/60">GO</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 mx-1" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground truncate max-w-[160px]">
              {pathPieces.length === 0 ? 'Home' : pathPieces[0]}
            </span>
            {pathPieces.length > 1 && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 mx-1" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[100px]">
                  {pathPieces[pathPieces.length - 1].replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          {/* Hover Expanded Navigation Links */}
          <div className="hidden group-hover:flex items-center gap-1 px-1.5 animate-in fade-in zoom-in-95 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Theme Toggle Utility Pill */}
        <div className="pointer-events-auto h-11 w-11 flex items-center justify-center bg-card/85 backdrop-blur-md border border-border rounded-full shadow-sm hover:border-accent/40 transition-all">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation HUD */}
      <div className="md:hidden w-full flex flex-col items-center pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto relative flex flex-col items-center bg-card/95 backdrop-blur-xl border border-border shadow-lg transition-all duration-300 overflow-hidden",
            isMobileMenuOpen ? "rounded-3xl w-full max-w-[320px]" : "rounded-full w-[240px]"
          )}
        >
          {/* Mobile Main Navigation Bar */}
          <div className="flex items-center justify-between w-full h-12 px-4">
            <Link
              href="/"
              className="text-xs font-mono font-bold uppercase tracking-wider text-foreground truncate max-w-[120px]"
            >
              {isMobileMenuOpen ? "George Ongoro" : (pathPieces[0] || "Home")}
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-foreground transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              >
                {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile Expanded Menu Panel */}
          <div
            className={cn(
              "w-full flex flex-col items-center gap-1.5 transition-all duration-300",
              isMobileMenuOpen ? "p-4 pt-0 max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            )}
          >
            <div className="w-full h-px bg-border my-2" />
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
