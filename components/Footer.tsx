import Link from 'next/link'
import { Github, Twitter, Linkedin, Rss, MessageSquare, Video, ArrowUpRight } from 'lucide-react'

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
    <footer className="border-t-4 border-foreground bg-card mt-20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
        
        {/* Brand & Bio */}
        <div className="md:col-span-5 space-y-8">
          <div className="inline-block p-4 brutal-border bg-accent text-accent-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transform -rotate-2 hover:rotate-0 transition-transform">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">george.2.0</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-2xl font-black leading-tight border-l-4 border-accent pl-5 py-1">
              Half-baked ideas, <br />
              fully-baked builds, <br />
              <span className="text-muted-foreground italic text-xl">and the messy bits in between.</span>
            </p>
          </div>
        </div>

        {/* Links & Socials */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* Socials Grid */}
          <div className="p-6 brutal-border bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col">
            <h4 className="font-black uppercase tracking-widest text-xl border-b-4 border-foreground pb-3 flex justify-between items-center mb-6">
              Connect <ArrowUpRight size={24} className="text-accent" />
            </h4>
            <div className="grid grid-cols-3 gap-3 flex-1 content-start">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 brutal-border bg-card hover:bg-accent hover:text-accent-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
                  title={s.name}
                >
                  <span className="group-hover:scale-110 transition-transform group-hover:-rotate-6">{s.icon}</span>
                  <span className="text-[10px] font-black uppercase mt-2 opacity-0 group-hover:opacity-100 absolute bottom-1 transition-opacity hidden sm:block">
                    {s.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Open Source & Copyright */}
          <div className="flex flex-col gap-8">
            <div className="p-6 brutal-border bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
               <h4 className="font-black uppercase tracking-widest text-lg mb-3">Open Source</h4>
               <p className="text-sm font-bold mb-6 leading-relaxed">
                 Created by <a href='https://github.com/004Ongoro' target='_blank' className='text-accent hover:underline decoration-2 underline-offset-4'>@004Ongoro</a>. <br/>
                 Steal it, break it, make it better.
               </p>
               <a href="https://github.com/004Ongoro/blahg-2.0" target="_blank" className="inline-flex w-full justify-center items-center gap-2 text-sm font-black uppercase bg-foreground text-background px-4 py-3 brutal-border hover:bg-accent hover:text-accent-foreground transition-colors group">
                 View on Github <Github size={16} className="group-hover:rotate-12 transition-transform" />
               </a>
            </div>
            
            <div className="flex flex-col justify-end flex-1">
              <div className="p-5 border-4 border-dashed border-muted-foreground/20 bg-muted/10 flex flex-col gap-1 hover:border-accent/50 transition-colors">
                <p className="font-black uppercase tracking-wider text-sm">© {new Date().getFullYear()} George Ongoro</p>
                <p className="text-muted-foreground font-bold text-xs">// No rights reserved</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
