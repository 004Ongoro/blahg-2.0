import Link from 'next/link'
import { Github, Twitter, Linkedin, Rss, MessageSquare, Video } from 'lucide-react'

const socials = [
  { name: 'Twitter', href: 'https://x.com/ongorogeorg_e', icon: <Twitter size={20} /> },
  { name: 'Bluesky', href: 'https://bsky.app/profile/ongoro.top', icon: <MessageSquare size={20} /> },
  { name: 'TikTok', href: 'https://www.tiktok.com/@developer.george', icon: <Video size={20} /> },
  { name: 'GitHub', href: 'https://github.com/004Ongoro', icon: <Github size={20} /> },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/georgeongoro2', icon: <Linkedin size={20} /> },
  { name: 'RSS', href: '/rss.xml', icon: <Rss size={20} /> },
]

export function Footer() {
  return (
    <footer className="border-t-4 border-foreground bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase italic">george.2.0</h3>
          <p className="text-muted-foreground font-medium">
            Half-baked ideas, fully-baked builds, and the messy bits in between.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-sm text-accent">Connect</h4>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 brutal-border bg-background hover:bg-accent hover:text-accent-foreground transition-all hover:-translate-y-1"
                title={s.name}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-sm md:text-right">
          <p className="font-bold">© {new Date().getFullYear()} George Ongoro // No rights reserved</p>
          <p className="text-muted-foreground">This site is created by <a href='https://github.com/004Ongoro' target='_blank' className='text-accent' >@004Ongoro </a>and it is open-source on <a href='https://github.com/004Ongoro/blahg-2.0' target='_blank' className='text-accent' >Github</a></p>
        </div>
      </div>
    </footer>
  )
}