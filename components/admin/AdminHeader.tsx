'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Mail, 
  Users,
  ChevronRight,
  Globe,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={14} /> },
  { name: 'New Post', href: '/admin/new', icon: <PlusCircle size={14} /> },
  { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail size={14} /> },
  { name: 'Subscribers', href: '/admin/newsletter/subscribers', icon: <Users size={14} /> },
]

export function AdminHeader() {
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none font-mono">
      {/* Desktop HUD Admin */}
      <div className="hidden md:flex items-center gap-2 max-w-full">
        {/* Identity Pill */}
        <div className={cn(
          "pointer-events-auto h-10 px-4 flex items-center bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm transition-all duration-500",
          isScrolled ? "opacity-100" : ""
        )}>
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            Admin <span className="text-accent">Portal</span>
          </Link>
        </div>

        {/* Navigation Pill */}
        <div className="pointer-events-auto flex items-center h-10 bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm p-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  isActive 
                    ? "bg-foreground text-background shadow-md" 
                    : "hover:bg-foreground/5 text-muted-foreground/60 hover:text-foreground"
                )}
              >
                {link.icon}
                <span className={cn(isActive ? "inline" : "hidden lg:inline")}>{link.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Action Pills */}
        <div className="pointer-events-auto flex items-center gap-1">
          <Link 
            href="/" 
            className="h-10 px-4 flex items-center gap-2 bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm hover:bg-foreground hover:text-background transition-all"
            title="View Live Site"
          >
            <Globe size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Live</span>
          </Link>

          <div className="h-10 w-10 flex items-center justify-center bg-background/70 backdrop-blur-md border border-foreground/5 rounded-full shadow-sm">
            <ThemeToggle />
          </div>

          <button 
            className="h-10 w-10 flex items-center justify-center bg-destructive/10 backdrop-blur-md border border-destructive/20 rounded-full shadow-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Mobile HUD Admin */}
      <div className="md:hidden w-full flex flex-col items-center pointer-events-none">
        <div className={cn(
          "pointer-events-auto relative flex flex-col items-center bg-background/80 backdrop-blur-lg border border-foreground/5 shadow-lg transition-all duration-500 overflow-hidden",
          isMobileMenuOpen ? "rounded-3xl w-full max-w-[280px]" : "rounded-full w-[220px]"
        )}>
          {/* Main Bar */}
          <div className="flex items-center justify-between w-full h-11 px-4">
            <Link href="/admin" className="text-[9px] font-black uppercase tracking-widest truncate">
              {isMobileMenuOpen ? "Admin Portal" : "Admin"}
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/5 text-foreground transition-transform active:scale-90"
            >
              {isMobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
            
            <div className="flex items-center gap-1">
              <ThemeToggle />
            </div>
          </div>

          {/* Expanded Menu */}
          <div className={cn(
            "w-full flex flex-col items-center gap-2 transition-all duration-300",
            isMobileMenuOpen ? "p-4 pt-0 max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}>
            <div className="w-full h-px bg-foreground/5 mb-2" />
            {adminLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "w-full py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2",
                    isActive 
                      ? "bg-accent text-accent-foreground shadow-lg" 
                      : "bg-foreground/5 text-muted-foreground"
                  )}
                >
                  {link.icon} {link.name}
                </Link>
              )
            })}
            <div className="w-full h-px bg-foreground/5 my-2" />
            <Link 
              href="/" 
              className="w-full py-3 px-4 rounded-2xl bg-foreground/5 text-[10px] font-black uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2"
            >
              <Globe size={12} /> View Site
            </Link>
            <button className="w-full py-3 px-4 rounded-2xl bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
