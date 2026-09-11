'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const utterancesTheme = mounted && resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

  useEffect(() => {
    if (!mounted || !commentsRef.current) return

    // Clear previous widget before inserting
    commentsRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', '004Ongoro/blog-comments')
    script.setAttribute('issue-term', 'url')
    script.setAttribute('theme', utterancesTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    commentsRef.current.appendChild(script)
  }, [mounted, utterancesTheme])

  return (
    <section className="mt-16 border border-border bg-card/80 backdrop-blur-xs p-6 md:p-8 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h2 className="text-lg md:text-xl font-sans font-bold text-foreground tracking-tight">
          Discussions & Comments
        </h2>
        <a
          href="https://utteranc.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono font-medium text-muted-foreground hover:text-accent uppercase tracking-wider transition-colors"
        >
          Utterances / GitHub ↗
        </a>
      </div>

      <div ref={commentsRef} className="utterances-container min-h-[160px] w-full" />
    </section>
  )
}