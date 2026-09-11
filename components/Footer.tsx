'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Rss, MessageSquare, ArrowUpRight, Heart } from 'lucide-react'
import { ContactDialog } from './ContactDialog'
import { GooglePreferredSourceButton } from './GooglePreferredSourceButton'

const DiscordIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
)

const MastodonIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.268 5.313c-.35-2.578-2.617-2.91-4.884-2.96-3.013-.068-6.03-.068-9.043 0-2.267.05-4.534.382-4.884 2.96-.18 1.482-.232 3.942-.012 5.617.22 1.675.815 3.322.9 5.38.074 1.8 1.487 3.29 3.014 3.524 1.77.272 3.542.456 5.316.556 1.77.1 3.54-.084 5.313-.272 1.527-.162 2.502-1.576 2.56-3.082.023-.602.044-1.206.064-1.81.077-2.26.155-4.52.078-6.78-.04-1.157-.272-2.247-.417-3.133zm-4.66 8.358c-.372.585-.923.948-1.65 1.086-1.077.204-2.153.25-3.23.136-.364-.04-.728-.106-1.09-.2-.733-.19-1.3-.593-1.7-1.21-.1-.157-.184-.325-.262-.5-.1-.225-.19-.46-.264-.7-.033-.1-.06-.2-.086-.3a4.992 4.992 0 0 1-.06-.75c.01-.767.143-1.517.4-2.25.263-.75.688-1.393 1.272-1.928.536-.492 1.173-.804 1.884-.935 1.077-.204 2.153-.25 3.23-.136.363.04.727.106 1.09.2.732.19 1.3.593 1.7 1.21.1.157.185.325.263.5.1.225.19.46.264.7.032.1.06.2.086.3.048.25.07.5.06.75-.01.767-.143 1.517-.4 2.25-.262.75-.687 1.393-1.27 1.928-.538.492-1.175.804-1.886.935zm-2.02-3.195c-.007.45-.143.834-.41 1.152-.295.352-.693.528-1.193.528-.485 0-.877-.17-1.174-.51-.277-.318-.42-.705-.43-1.16-.017-1.054.385-1.58 1.206-1.58.37 0 .668.12.894.364.227.243.344.576.353 1 .006.27-.083.473-.266.61-.137.102-.303.153-.5.153-.207 0-.374-.05-.5-.153a.58.58 0 0 1-.226-.457c0-.233.166-.35.5-.35h.063c.27 0 .42-.1.453-.3a1.442 1.442 0 0 0-.256-1.002.825.825 0 0 0-.677-.318.825.825 0 0 0-.678.318c-.244.3-.367.668-.37 1.103v.25c0 .546.173.985.52 1.316.347.33.784.497 1.313.497.522 0 .953-.163 1.293-.49.34-.326.516-.76.527-1.303v-.25c.01-.433-.11-.8-.36-1.102a.825.825 0 0 0-.677-.318.825.825 0 0 0-.677.318c-.22.246-.34.58-.354 1.002.033.2-.12.3-.455.3h-.063c-.333 0-.5.117-.5.35a.58.58 0 0 0 .227.457c.127.102.293.153.5.153.197 0 .363-.05.5-.153.183-.137.272-.34.266-.61z" />
  </svg>
)

const socials = [
  { name: 'Twitter', href: 'https://x.com/ongorogeorg_e', icon: <Twitter size={18} /> },
  { name: 'Bluesky', href: 'https://bsky.app/profile/geohack.top', icon: <MessageSquare size={18} /> },
  { name: 'GitHub', href: 'https://github.com/004Ongoro', icon: <Github size={18} /> },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/georgeongoro2', icon: <Linkedin size={18} /> },
  { name: 'Mastodon', href: 'https://mastodon.social/@ongoro_ge', icon: <MastodonIcon size={18} /> },
  { name: 'Discord', href: 'https://discord.gg/ekqkBkc7', icon: <DiscordIcon size={18} /> },
  { name: 'RSS Feed', href: '/rss.xml', icon: <Rss size={18} /> },
]

// Organized Navigation Links Across All Pages
const navGroups = [
  {
    title: 'Explore',
    links: [
      { name: 'Posts', href: '/' },
      { name: 'Dispatches', href: '/newsletter/archive' },
      { name: 'Series', href: '/series' },
      { name: 'Bookmarks', href: '/bookmarks' },
      { name: 'Tag Library', href: '/tags' },
      { name: 'Archive', href: '/archive' },
    ],
  },
  {
    title: 'Pages & Focus',
    links: [
      { name: 'About', href: '/about' },
      { name: '/now Log', href: '/now' },
      { name: 'Contact', href: '/contact' },
      { name: 'Guestbook', href: '/guestbook' },
      { name: 'Developer Setup', href: '/setup' },
      { name: 'Guest Logs', href: 'https://guest-blog.geohack.top' },
      { name: 'Geodocs Hub', href: 'https://geodocs.geohack.top' },
    ],
  },
  {
    title: 'Connect & Support',
    links: [
      { name: 'GitHub Sponsors', href: 'https://github.com/sponsors/004Ongoro' },
      { name: 'Newsletter', href: '/newsletter' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Admin Console', href: '/admin' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40 pt-16 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Main Footer Section: Brand & Structured Navigation */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pb-14 border-b border-border">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Link href="/" className="text-2xl font-sans font-extrabold tracking-tight text-foreground block">
                George Ongoro <span className="text-accent">Blog</span>
              </Link>
              <p className="text-sm font-sans leading-relaxed text-muted-foreground max-w-sm">
                Technical writings on web architecture, software engineering, and modern systems. 
                Independent & open source.
              </p>
            </div>

            {/* Actions Row: Say Hello, GitHub Sponsors, & Google Preferred Source */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ContactDialog trigger={
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider hover:bg-accent hover:text-accent-foreground transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Say Hello <ArrowUpRight className="h-4 w-4" />
                </button>
              } />

              <a
                href="https://github.com/sponsors/004Ongoro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Sponsor George Ongoro on GitHub"
              >
                <Heart className="h-4 w-4 fill-current text-pink-500" />
                <span>Sponsor</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </a>

              <GooglePreferredSourceButton />
            </div>

            {/* Social Icons Row */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground/70 block">
                Connect Across The Web
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-muted-foreground hover:text-accent hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title={social.name}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Nav Links Column Matrix (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
                        >
                          <span>{link.name}</span>
                          <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar: Copyright, Single Official Badge, & System Status */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          
          {/* Copyright */}
          <p className="text-xs font-mono font-medium text-muted-foreground">
            © {new Date().getFullYear()} George Ongoro Blog — All rights reserved.
          </p>

          {/* Single Official Blog Badge */}
          <div className="flex items-center justify-center">
            <a
              href="https://code.geohack.top"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform duration-200"
              title="George Ongoro Blog"
            >
              <img src="/ongoro-badge.svg" alt="George Ongoro Blog Badge" width="88" height="31" />
            </a>
          </div>

          {/* Telemetry Status Indicator */}
          <a
            href="https://code-geohack.openstatus.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:border-accent/40 text-xs transition-all shadow-xs"
            title="OpenStatus Telemetry Status"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Systems Operational
            </span>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </a>

        </div>

      </div>
    </footer>
  )
}
