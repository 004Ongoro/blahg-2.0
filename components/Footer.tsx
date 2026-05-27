'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Rss, MessageSquare, Video, ArrowUpRight } from 'lucide-react'
import { ContactDialog } from './ContactDialog'

const socials = [
  { name: 'Twitter', href: 'https://x.com/ongorogeorg_e', icon: <Twitter size={18} /> },
  { name: 'Bluesky', href: 'https://bsky.app/profile/deepread.website', icon: <MessageSquare size={18} /> },
  { name: 'GitHub', href: 'https://github.com/004Ongoro', icon: <Github size={18} /> },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/georgeongoro2', icon: <Linkedin size={18} /> },
  { name: 'RSS', href: '/rss.xml', icon: <Rss size={18} /> },
]

const secondaryLinks = [
  { name: 'newsletter', href: '/newsletter' },
  { name: 'guestbook', href: '/guestbook' },
  { name: 'series', href: '/series' },
  { name: 'admin', href: '/admin' },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-foreground/10 bg-background pb-12 pt-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left Column: Brand & Nav */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
                george<span className="text-accent">.</span>2.0
              </Link>
              <p className="max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">
                Software engineer, occasional writer, and professional over-thinker. 
                Building things that (mostly) work.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {secondaryLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Column: Contact & Socials */}
          <div className="flex flex-col items-start md:items-end justify-between gap-8">
            <ContactDialog trigger={
              <button className="group flex items-center gap-2 text-lg font-black uppercase tracking-tighter hover:text-accent transition-colors">
                Say Hello <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            } />

            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-md transition-all"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-foreground/5 pt-8 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            © {new Date().getFullYear()} George Ongoro — Built with Next.js & Pure Spite
          </p>
          <div className="h-1 w-1 rounded-full bg-accent/20" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            No rights reserved — Steal everything
          </p>
        </div>
      </div>
    </footer>
  )
}
