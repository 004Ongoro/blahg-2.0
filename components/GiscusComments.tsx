'use client'

import { useEffect, useRef } from 'react'

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'your-username/your-repo')
    script.setAttribute('data-repo-id', 'your-repo-id')
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', 'your-category-id')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'dark')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    ref.current.appendChild(script)
  }, [])

  return (
    <div ref={ref}>
      <p className="text-muted-foreground text-sm">
        To enable comments, configure Giscus with your GitHub repository.
        Visit{' '}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          giscus.app
        </a>{' '}
        to set it up.
      </p>
    </div>
  )
}
