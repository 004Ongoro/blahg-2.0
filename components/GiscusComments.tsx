// components/GiscusComments.tsx
'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()

  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="mt-20 border border-foreground/5 bg-background/50 backdrop-blur-md p-8 rounded-[32px] shadow-xs">
      <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-8 flex items-center gap-2 border-b border-foreground/5 pb-4">
        Discussions
      </h2>
      <Giscus
        id="comments"
        repo="004Ongoro/blahg-2.0"
        repoId="R_kgDOSCcO5Q"
        category="General"
        categoryId="DIC_kwDOSCcO5c4C65oX"
        mapping="pathname"
        strict="0"
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