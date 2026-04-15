// app/newsletter/page.tsx
import { Newsletter } from '@/components/Newsletter'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NewsletterSubscriptionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
              Join the <span className="text-accent underline">Mailing List</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              Get the latest insights on tech, code, and design delivered straight to your inbox. No spam, ever.
            </p>
          </div>
          
          <Newsletter />
          
          <p className="mt-8 text-center text-sm text-muted-foreground italic">
            Trusted by developers worldwide.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}