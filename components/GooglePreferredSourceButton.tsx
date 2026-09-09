'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface Props {
  className?: string
}

export function GooglePreferredSourceButton({ className = '' }: Props) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Official Google Preferred Source Interactive Button (populated by publisher.js) */}
      <div
        google-add-preferred-source-btn=""
        data-theme={theme}
        data-lang="en"
      />
    </div>
  )
}
