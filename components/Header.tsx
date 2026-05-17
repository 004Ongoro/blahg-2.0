'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'posts', href: '/' },
  { name: 'series', href: '/series' },
  { name: 'tags', href: '/tags' },
  { name: 'archive', href: '/archive' },
  { name: 'issues', href: '/newsletter/archive' },
  { name: 'guestbook', href: '/guestbook' },
  { name: 'newsletter', href: '/newsletter' },
  { name: 'admin', href: '/admin' },
]

// Main header component
export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-foreground bg-background">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter hover:text-accent transition-colors">
          george<span className="text-accent">.</span>2.0
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="font-bold hover:underline decoration-accent decoration-4 underline-offset-4">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 brutal-border bg-accent text-accent-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute top-[68px] left-0 w-full bg-background border-b-4 border-foreground md:hidden overflow-hidden transition-all duration-300 ease-in-out z-40",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <div key={link.name} className={cn(
              "transform transition-transform duration-300 delay-100",
              isOpen ? "translate-x-0" : "-translate-x-10"
            )}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black uppercase hover:text-accent flex items-center gap-2"
              >
                <span className="text-accent">{'>'}</span> {link.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}