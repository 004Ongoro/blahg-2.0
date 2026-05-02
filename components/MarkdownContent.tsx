'use client'

import { useMemo } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'

interface MarkdownContentProps {
  content: string
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/v\/([^&\s?]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Process YouTube embeds in markdown
function processYouTubeEmbeds(content: string): string {
  // Match YouTube URLs on their own line or in markdown link format
  const youtubeRegex = /(?:^|\n)(?:\[.*?\]\()?(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+)(?:\))?(?:\n|$)/g
  
  return content.replace(youtubeRegex, (match, url) => {
    const videoId = extractYouTubeId(url)
    if (!videoId) return match
    
    return `\n<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n`
  })
}

// Add title bars to code blocks
function processCodeBlocks(html: string): string {
  // Match code blocks with language class and extract language
  return html.replace(
    /<pre><code class="hljs language-(\w+)">/g,
    (_, lang) => {
      const displayLang = lang.charAt(0).toUpperCase() + lang.slice(1)
      return `<div class="code-block-wrapper"><div class="code-title-bar"><span class="code-lang">${displayLang}</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent)">Copy</button></div><pre><code class="hljs language-${lang}">`
    }
  ).replace(
    /<\/code><\/pre>/g,
    '</code></pre></div>'
  )
}

// Ensure all links in the article open in a new tab
function processLinks(html: string): string {
  return html.replace(/<a\s+href=/g, '<a target="_blank" rel="noopener noreferrer" href=')
}

// Implement custom syntax for highlights
function processCustomSyntax(content: string): string {
  // !!definition!! -> highlighted term
  let processed = content.replace(/!!(.+?)!!/g, '<span class="definition-highlight">$1</span>')
  
  // (1) or [1] references
  processed = processed.replace(/(^|\s)(\[(\d+)\]|\((\d+)\))/g, '$1<span class="reference-highlight">$2</span>')
  
  return processed
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const htmlContent = useMemo(() => {
    // Process custom syntax and YouTube embeds first
    const withCustomSyntax = processCustomSyntax(content)
    const processedContent = processYouTubeEmbeds(withCustomSyntax)
    
    const result = unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight, { detect: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(processedContent)

    // Post-process HTML
    let finalHtml = processCodeBlocks(String(result))
    finalHtml = processLinks(finalHtml)
    
    return finalHtml
  }, [content])

  return (
    <div
      className="prose-brutal"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
