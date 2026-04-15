'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!id) {
      setStatus('error')
      return
    }

    const performUnsubscribe = async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        
        if (res.ok) setStatus('success')
        else setStatus('error')
      } catch {
        setStatus('error')
      }
    }

    performUnsubscribe()
  }, [id])

  return (
    <div className="max-w-md w-full brutal-border bg-card p-8 brutal-shadow-lg text-center">
      <h1 className="text-3xl font-black mb-4 uppercase">Newsletter</h1>
      
      {status === 'loading' && <p className="font-bold italic">Processing your request...</p>}
      
      {status === 'success' && (
        <>
          <p className="mb-6 font-bold text-lg text-green-600">You have been unsubscribed.</p>
          <p className="text-sm text-muted-foreground mb-8">We're sorry to see you go! You can resubscribe anytime on the home page.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <p className="mb-6 font-bold text-lg text-destructive">Something went wrong.</p>
          <p className="text-sm text-muted-foreground mb-8">We couldn't process your request. Please try again or contact support.</p>
        </>
      )}

      <Link href="/" className="brutal-btn bg-accent text-accent-foreground px-6 py-2 font-bold inline-block">
        Return to Blog
      </Link>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense fallback={<p>Loading...</p>}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  )
}