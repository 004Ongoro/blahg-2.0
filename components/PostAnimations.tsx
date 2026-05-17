'use client'

import { useEffect, useState } from 'react'

export default function PostAnimations() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-2 bg-accent z-[60] origin-left transition-transform duration-75 ease-out"
      style={{ transform: `scaleX(${scrollProgress / 100})` }}
    />
  )
}