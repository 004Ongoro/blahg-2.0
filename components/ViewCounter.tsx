'use client'

import { useEffect } from 'react'

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    // Only increment views in production to avoid polluting stats during dev
    // Or you can remove this check if you want to see it work locally
    const incrementView = async () => {
      try {
        await fetch(`/api/posts/${slug}/view`, {
          method: 'POST',
        })
      } catch (err) {
        console.error('Failed to increment view count', err)
      }
    }

    incrementView()
  }, [slug])

  return null // This component doesn't render anything, just handles the logic
}
