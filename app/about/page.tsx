import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CommunityCallout } from '@/components/CommunityCallout'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About | George Ongoro',
  description: 'Full-stack developer, open source contributor, and tech volunteer based in Nairobi.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <Header />
      
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 md:py-24 w-full">
        <article className="space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
              Building, teaching, <br />
              and <span className="text-accent italic">tinkering</span> in Nairobi.
            </h1>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground font-medium">
            <p>
              I'm George, a full-stack developer based in Nairobi. My days are spent navigating the complexities of 
              <span className="text-foreground font-bold"> React, C#, Java, JavaScript,</span> and <span className="text-foreground font-bold">Go</span>. 
              But beyond the code, I'm an open-source contributor and a tech volunteer, helping selected institutions 
              and organizations in Nairobi leverage technology for good.
            </p>

            <p>
              I've always been driven by curiosity. Whether I'm tinkering with a new framework, exploring an emerging 
              technology, or getting lost in a good book, I'm constantly looking for ways to expand my horizon. 
              When I'm not in front of a terminal, you'll probably find me gaming, writing, or deep in conversation 
              about the latest tech trends.
            </p>

            <h2 className="text-2xl font-black text-foreground pt-8 uppercase tracking-tighter">
              Why this blog?
            </h2>
            
            <p>
              This space isn't just about code—it's about the journey of <span className="text-accent italic">learning together</span>. 
              I started this blog to document what I learn, share my opinions (sometimes spicy, always honest), 
              and create a hub where other developers can hang out.
            </p>
          </div>

          <CommunityCallout />

          <footer className="pt-12 border-t border-foreground/5">
            <Link 
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors"
            >
              Back to posts <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
