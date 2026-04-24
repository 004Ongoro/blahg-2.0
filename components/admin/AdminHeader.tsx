'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
<<<<<<< HEAD
import { LayoutDashboard, FileText, PlusCircle, LogOut, Menu, X, Mail, Users } from 'lucide-react'
=======
import { LayoutDashboard, FileText, PlusCircle, LogOut, Menu, X, Mail } from 'lucide-react'
>>>>>>> f20ccfbde4a0698bf3fc069451cf49f956c9b26e

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { name: 'New Post', href: '/admin/new', icon: <PlusCircle size={18} /> },
  { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail size={18} /> },
<<<<<<< HEAD
  { name: 'Subscribers', href: '/admin/newsletter/subscribers', icon: <Users size={18} /> },
=======
>>>>>>> f20ccfbde4a0698bf3fc069451cf49f956c9b26e
]

export function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="border-b-4 border-foreground bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-black text-xl uppercase tracking-tighter">
            Admin<span className="text-accent">.</span>Portal
          </Link>
          
          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 font-bold hover:text-accent transition-colors ${
                  pathname === link.href ? 'text-accent' : ''
                }`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="hidden sm:block text-sm font-bold hover:underline"
          >
            View Site
          </Link>
          <button className="p-2 brutal-border bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors">
            <LogOut size={20} />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 brutal-border bg-accent text-accent-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-64 bg-card border-l-4 border-foreground z-50 p-6 md:hidden flex flex-col gap-6"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-black uppercase text-sm text-accent">Navigation</span>
              <button onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>
            
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 text-xl font-black uppercase ${
                  pathname === link.href ? 'text-accent' : ''
                }`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
            
            <div className="mt-auto pt-6 border-t-2 border-muted">
              <Link 
                href="/" 
                className="flex items-center gap-4 font-bold uppercase text-sm"
              >
                <FileText size={18} /> Exit to Site
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}