import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'
import { Mail, MapPin, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact | George Ongoro',
  description: 'Get in touch with George Ongoro for technical inquiries, collaboration, or feedback.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg font-mono">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-24 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to feed
        </Link>

        <header className="mb-12 border-b-2 border-foreground pb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded mb-3 inline-block">
            Direct Transmission
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Get in <span className="text-accent italic">Touch</span>
          </h1>
          <p className="text-muted-foreground font-medium mt-4 text-sm max-w-xl leading-relaxed">
            Have a technical question, feedback on an article, or an open-source collaboration idea? Drop a message directly below.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info */}
          <aside className="lg:col-span-5 space-y-8 p-6 border border-foreground/10 rounded-2xl bg-foreground/[0.01]">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <MapPin size={14} className="text-accent" /> Location
              </span>
              <p className="text-sm font-bold text-foreground">Nairobi, Kenya</p>
            </div>

            <div className="space-y-3 border-t border-foreground/5 pt-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <Mail size={14} className="text-accent" /> Primary Dispatch Email
              </span>
              <a
                href="mailto:george@geohack.top"
                className="text-sm font-bold text-accent hover:underline block break-words"
              >
                george@geohack.top
              </a>
            </div>

            <div className="space-y-3 border-t border-foreground/5 pt-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <MessageSquare size={14} className="text-accent" /> Social Links
              </span>
              <ul className="text-xs space-y-2 font-bold text-muted-foreground">
                <li>
                  <a href="https://x.com/ongorogeorg_e" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    Twitter / X: @ongorogeorg_e
                  </a>
                </li>
                <li>
                  <a href="https://github.com/004Ongoro" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    GitHub: 004Ongoro
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/georgeongoro2" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    LinkedIn: georgeongoro2
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Contact Form */}
          <section className="lg:col-span-7">
            <ContactForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
