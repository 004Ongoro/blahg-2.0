'use client'

import { useState } from 'react'

interface FaviconImageProps {
  src: string
  alt?: string
  className?: string
}

export function FaviconImage({ src, alt = '', className }: FaviconImageProps) {
  const [error, setError] = useState(false)

  if (error) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
