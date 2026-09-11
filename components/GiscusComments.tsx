'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const giscusTheme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    // Clear any previous Giscus elements to prevent duplication
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', '004Ongoro/blahg-2.0')
    script.setAttribute('data-repo-id', 'R_kgDOSCcO5Q')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOSCcO5c4C65oX')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', giscusTheme)
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    containerRef.current.appendChild(script)
  }, [mounted, giscusTheme])

  return (
    <section className="mt-16 border border-border bg-card/80 backdrop-blur-xs p-6 md:p-8 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h2 className="text-lg md:text-xl font-sans font-bold text-foreground tracking-tight">
          Discussions & Comments
        </h2>
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono font-medium text-muted-foreground hover:text-accent uppercase tracking-wider transition-colors"
        >
          GitHub Powered ↗
        </a>
      </div>

      <div ref={containerRef} className="giscus-container min-h-[160px] w-full" />
    </section>
  )
}