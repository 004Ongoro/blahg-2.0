'use client'

import { useEffect } from 'react'

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    const incrementView = async () => {
      try {
        // Check if we already viewed this post in the last 24 hours
        const lastViewed = localStorage.getItem(`viewed_${slug}`)
        const now = Date.now()
        
        if (lastViewed && now - parseInt(lastViewed) < 24 * 60 * 60 * 1000) {
          return
        }

        await fetch(`/api/posts/${slug}/view`, {
          method: 'POST',
        })

        localStorage.setItem(`viewed_${slug}`, now.toString())
      } catch (err) {
        console.error('Failed to increment view count', err)
      }
    }

    incrementView()
  }, [slug])

  return null
}
