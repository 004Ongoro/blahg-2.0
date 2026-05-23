import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { LinkTracker } from './LinkTracker'
import { CodeExecutor } from './CodeExecutor'

interface MarkdownContentProps {
  content: string
}

const RUNNABLE_LANGS = [
  'js', 'javascript', 
  'ts', 'typescript', 
  'python', 'py', 
  'react', 'jsx', 'tsx',
  'cpp', 'c++',
  'go',
  'java'
]

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
  const youtubeRegex = /(?:^|\n)(?:\[.*?\]\()?(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+)(?:\))?(?:\n|$)/g
  
  return content.replace(youtubeRegex, (match, url) => {
    const videoId = extractYouTubeId(url)
    if (!videoId) return match
    
    return `\n<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n`
  })
}

// Add title bars to code blocks
function processCodeBlocks(html: string): string {
  return html.replace(
    /<pre><code class="hljs language-(\w+)">/g,
    (_, lang) => {
      const displayLang = lang.charAt(0).toUpperCase() + lang.slice(1)
      const isRunnable = RUNNABLE_LANGS.includes(lang.toLowerCase())
      const runButton = isRunnable 
        ? `<button class="run-btn ml-2 px-2 py-1 bg-green-500 text-black font-black uppercase text-[10px] brutal-border hover:bg-green-400 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none" onclick="window.runCode(this)">Run</button>`
        : ''
      
      return `<div class="code-block-wrapper"><div class="code-title-bar"><span class="code-lang font-black uppercase text-xs">${displayLang}</span>${runButton}<button class="copy-btn ml-auto font-black uppercase text-[10px] hover:text-accent transition-colors" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent)">Copy</button></div><pre><code class="hljs language-${lang}">`
    }
  ).replace(
    /<\/code><\/pre>/g,
    '</code></pre></div>'
  )
}

// Inject paperclip icons for section links
function processHeadings(html: string): string {
  return html.replace(
    /<(h[1-6])\s+id="([^"]+)">(.+?)<\/\1>/g,
    (match, tag, id, content) => {
      return `<${tag} id="${id}" class="group flex items-center gap-2">
        <span>${content}</span>
        <button 
          onclick="const url = new URL(window.location.href); url.hash = '${id}'; navigator.clipboard.writeText(url.href);"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground inline-flex items-center justify-center"
          title="Copy link to section"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
      </${tag}>`
    }
  )
}

// Ensure all links in the article open in a new tab and have tracking refs
function processLinks(html: string): string {
  const currentHostname = 'code.geohack.top'
  
  return html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g, (match, href) => {
    if (href.startsWith('http')) {
      try {
        const url = new URL(href)
        if (url.hostname === currentHostname || url.hostname === 'localhost') {
          return `<a target="_blank" rel="noopener noreferrer" href="${href}"`
        }

        url.searchParams.set('utm_source', currentHostname)
        url.searchParams.set('utm_medium', 'blog')
        url.searchParams.set('utm_campaign', 'blog_reading')
        
        return `<a target="_blank" rel="noopener noreferrer" href="${url.toString()}"`
      } catch (e) {
        return `<a target="_blank" rel="noopener noreferrer" href="${href}"`
      }
    }
    return match
  })
}

// Implement custom syntax for highlights
function processCustomSyntax(content: string): string {
  let processed = content.replace(/!!(.+?)!!/g, '<span class="definition-highlight">$1</span>')
  processed = processed.replace(/(^|\s)(\[(\d+)\]|\((\d+)\))/g, '$1<span class="reference-highlight">$2</span>')
  return processed
}

// Process side-notes/callouts
function processSideNotes(content: string): string {
  const sideNoteRegex = /:::(note|warning|tip|info)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::/g
  
  return content.replace(sideNoteRegex, (match, type, title, body) => {
    const defaultTitles = {
      note: 'Note',
      warning: 'Warning',
      tip: 'Pro-Tip',
      info: 'Information'
    }
    
    const displayTitle = (title || defaultTitles[type as keyof typeof defaultTitles]).trim()
    const icon = {
      note: '📝',
      warning: '⚠️',
      tip: '💡',
      info: 'ℹ️'
    }[type as keyof typeof defaultTitles]

    return `\n<div class="callout callout-${type}"><div class="callout-header"><span class="callout-icon">${icon}</span><span class="callout-title">${displayTitle}</span></div><div class="callout-content">${body}</div></div>\n`
  })
}

export async function MarkdownContent({ content }: MarkdownContentProps) {
  // Process custom syntax and YouTube embeds first
  const withCustomSyntax = processCustomSyntax(content)
  const withSideNotes = processSideNotes(withCustomSyntax)
  const processedContent = processYouTubeEmbeds(withSideNotes)
  
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedContent)

  // Post-process HTML
  let finalHtml = processCodeBlocks(String(result))
  finalHtml = processHeadings(finalHtml)
  finalHtml = processLinks(finalHtml)

  return (
    <>
      <LinkTracker />
      <CodeExecutor />
      <div
        className="prose-brutal"
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />
    </>
  )
}
