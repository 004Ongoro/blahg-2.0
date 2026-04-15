'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()

  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="mt-12 brutal-border bg-card p-6 brutal-shadow">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-accent">{'>'}</span> comments
      </h2>
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
    </div>
  )
}