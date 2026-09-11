'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()

  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <section className="mt-16 border border-border bg-card/80 backdrop-blur-xs p-6 md:p-8 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h2 className="text-lg md:text-xl font-sans font-bold text-foreground tracking-tight">
          Discussions & Comments
        </h2>
        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
          GitHub Powered
        </span>
      </div>

      <Giscus
        id="comments"
        repo="004Ongoro/blahg-2.0"
        repoId="R_kgDOSCcO5Q"
        category="Announcements"
        categoryId="DIC_kwDOSCcO5c4C65oX"
        mapping="pathname"
        term="Welcome to giscus!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
      />
    </section>
  )
}