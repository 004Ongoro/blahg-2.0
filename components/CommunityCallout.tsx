'use client'

import Link from 'next/link'
import { MessageSquarePlus, PenTool, ArrowRight, ExternalLink } from 'lucide-react'

export function CommunityCallout() {
  return (
    <section className="my-14 p-6 md:p-8 rounded-3xl border border-foreground/10 dark:border-white/10 bg-card/60 backdrop-blur-md shadow-sm">
      <div className="mb-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 mb-1">
          Community & Contributions
        </h3>
        <p className="text-sm font-semibold text-foreground">
          Connect with readers or publish your own writing on this platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Guestbook */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-foreground/10 dark:border-white/10 bg-background/70 hover:border-accent/40 transition-all duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                Digital Logbook
              </span>
              <MessageSquarePlus className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="text-base font-extrabold text-foreground group-hover:text-accent transition-colors mb-1.5">
              Sign the Guestbook ✍️
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-4">
              Leave your handle, drop a friendly note, or share quick feedback in the public guest log.
            </p>
          </div>

          <Link
            href="/guestbook"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:text-white transition-all shadow-2xs"
          >
            <span>Sign Guestbook</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Card 2: Guest Blog */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-foreground/10 dark:border-white/10 bg-background/70 hover:border-accent/40 transition-all duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-foreground/10 text-foreground">
                Guest Publishing
              </span>
              <PenTool className="w-4 h-4 text-foreground group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="text-base font-extrabold text-foreground group-hover:text-accent transition-colors mb-1.5">
              Write a Guest Post 📝
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-4">
              Want to publish your own article? Share technical breakdowns, guides, or stories on the Guest Blog.
            </p>
          </div>

          <a
            href="https://guest-blog.geohack.top"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border border-foreground/20 text-foreground hover:border-accent hover:text-accent transition-all shadow-2xs"
          >
            <span>Visit Guest Blog</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
