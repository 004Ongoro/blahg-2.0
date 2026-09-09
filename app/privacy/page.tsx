import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ShieldCheck, Lock, Eye, Mail, Database, Cookie, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | George Ongoro Blog',
  description: 'Privacy Policy and Data Protection declaration for George Ongoro Blog regarding email collection, cookies, and Google Analytics.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-mono flex flex-col text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Navigation back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Transmission Feed
        </Link>

        {/* Page Header */}
        <header className="mb-12 border-b-2 border-foreground pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded mb-3 inline-block">
                Legal & Compliance
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Privacy <span className="text-accent italic">Policy</span>
              </h1>
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Last Updated: September 2026
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-12 leading-relaxed text-sm">
          {/* Overview */}
          <section className="p-6 border border-foreground/10 rounded-2xl bg-foreground/[0.01] space-y-4">
            <div className="flex items-center gap-3 text-accent font-black uppercase tracking-wider text-xs">
              <ShieldCheck size={18} />
              <span>Data Protection Commitment</span>
            </div>
            <p className="text-muted-foreground">
              Your privacy is fundamentally respected on this site. This Data Protection Declaration explains how we handle personal information (such as subscriber emails), local browser storage, and analytics tracking in accordance with international data protection laws (including GDPR, CCPA, and applicable local legislation).
            </p>
          </section>

          {/* Section 1: Information Collected */}
          <section className="space-y-4 border-b border-foreground/5 pb-8">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Mail size={16} className="text-accent" />
              1. Information We Collect
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Email Addresses:</strong> When you voluntarily subscribe to the newsletter or submit a guest post transmission, we collect and store your email address in our encrypted database. Your email is exclusively used to deliver broadcast dispatches and account notifications.
              </p>
              <p>
                <strong className="text-foreground">Usage Data & Analytics:</strong> We use Google Analytics (`gtag.js`) to gather aggregated, anonymized metrics on traffic, page view duration, operating systems, and device types to improve our content delivery.
              </p>
              <p>
                <strong className="text-foreground">Local Browser Storage & Cookies:</strong> We utilize cookies and `localStorage` to save user interface preferences (such as dark/light themes), store draft edits in the admin panel to prevent data loss, and record your cookie consent choice.
              </p>
            </div>
          </section>

          {/* Section 2: How We Use Your Data */}
          <section className="space-y-4 border-b border-foreground/5 pb-8">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Eye size={16} className="text-accent" />
              2. How Your Data Is Processed
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To dispatch requested newsletter updates via verified email services (e.g., Resend API).</li>
              <li>To generate statistical metrics on article popularity and site performance via Google Analytics.</li>
              <li>To maintain continuous draft auto-saving within local browser storage during post composition.</li>
              <li>We <strong className="text-foreground">never sell, rent, or trade</strong> your personal email address or data to third-party advertisers.</li>
            </ul>
          </section>

          {/* Section 3: Cookies & Tracking Control */}
          <section className="space-y-4 border-b border-foreground/5 pb-8">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Cookie size={16} className="text-accent" />
              3. Cookie Choices & Opt-Out
            </h2>
            <p className="text-muted-foreground">
              You can control or disable non-essential cookies and analytics tracking at any time using our cookie banner choice or directly through your web browser settings. Disabling cookies will not affect your access to reading blog articles.
            </p>
          </section>

          {/* Section 4: Your Rights */}
          <section className="space-y-4 border-b border-foreground/5 pb-8">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Lock size={16} className="text-accent" />
              4. Your Rights & Unsubscribing
            </h2>
            <p className="text-muted-foreground">
              Under applicable data protection laws, you have full right to access, rectify, or request permanent deletion of your stored email address from our records. Every newsletter dispatch contains a 1-click 
              <Link href="/unsubscribe" className="text-accent font-bold hover:underline mx-1">
                Unsubscribe Link
              </Link>
              that immediately purges your active subscriber record.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Database size={16} className="text-accent" />
              5. Contact & Data Enquiries
            </h2>
            <p className="text-muted-foreground">
              If you have any questions or data requests regarding this Privacy Policy, please email <a href="mailto:george@geohack.top" className="text-accent font-bold hover:underline">george@geohack.top</a> or use the built-in contact dialog on this site.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
