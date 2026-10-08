import { slugify } from '@/lib/utils'

export interface ParsedPollOption {
  id: string
  text: string
}

export interface ParsedPoll {
  slug: string
  question: string
  options: ParsedPollOption[]
}

export type ContentSegment =
  | { type: 'markdown'; content: string }
  | { type: 'poll'; data: ParsedPoll }

/**
 * Regex to match poll blocks:
 * :::poll[:<slug>] ["<question>" | '<question>' | <question>]
 * - [option-slug:] Option text
 * :::
 */
export const POLL_BLOCK_REGEX = /(?:^|\n)[ \t]*:::poll(?::([a-zA-Z0-9_-]+))?(?:[ \t]+(?:"([^"\n]+)"|'([^'\n]+)'|([^\n]+)))?[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*(?=\n|$)/g

/**
 * Parses the body text of a poll into structured options
 */
export function parsePollOptions(body: string): ParsedPollOption[] {
  const lines = body.split(/\r?\n/)
  const options: ParsedPollOption[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line.startsWith('- ') && !line.startsWith('* ')) continue

    const content = line.substring(2).trim()
    if (!content) continue

    // Check for explicit "slug: Option text" format
    const colonMatch = content.match(/^([^:\n\r]+?):\s*(.+)$/)
    if (colonMatch) {
      const optionId = slugify(colonMatch[1].trim())
      const text = colonMatch[2].trim()
      if (optionId && text) {
        options.push({ id: optionId, text })
        continue
      }
    }

    // Auto-generate option slug from text
    const optionId = slugify(content) || `opt-${options.length + 1}`
    options.push({ id: optionId, text: content })
  }

  return options
}

/**
 * Parses a single :::poll ... ::: block string into a ParsedPoll object
 */
export function parsePollBlock(blockText: string): ParsedPoll | null {
  const normalized = blockText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  const regex = new RegExp(POLL_BLOCK_REGEX.source, 'g')
  const match = regex.exec(normalized)
  if (!match) return null

  const rawSlug = match[1]?.trim()
  let question = (match[2] || match[3] || match[4] || '').trim()
  let body = match[5] || ''

  if (!question) {
    const bodyLines = body.split('\n')
    const firstLine = (bodyLines[0] || '').trim()
    if (firstLine && !firstLine.startsWith('- ') && !firstLine.startsWith('* ')) {
      question = firstLine
      body = bodyLines.slice(1).join('\n')
    }
  }

  const options = parsePollOptions(body)
  if (!question || options.length < 2) return null

  const slug = (rawSlug || slugify(question) || `poll-${Date.now()}`).toLowerCase()

  return {
    slug,
    question,
    options,
  }
}

/**
 * Splits raw markdown content into sequential markdown and poll segments
 */
export function splitContentWithPolls(content: string): ContentSegment[] {
  if (!content) return [{ type: 'markdown', content: '' }]

  // Normalize all line endings to \n
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Fresh regex instance to ensure lastIndex is always 0
  const pollRegex = new RegExp(POLL_BLOCK_REGEX.source, 'g')

  const segments: ContentSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pollRegex.exec(normalized)) !== null) {
    const fullMatch = match[0]
    let matchStart = match.index

    // If the match captured a leading newline from (?:^|\n), adjust the start
    if (fullMatch.startsWith('\n')) {
      matchStart += 1
    }

    // Push preceding markdown segment if any
    if (matchStart > lastIndex) {
      const mdContent = normalized.substring(lastIndex, matchStart)
      if (mdContent.trim()) {
        segments.push({ type: 'markdown', content: mdContent })
      }
    }

    const rawSlug = match[1]?.trim()
    let question = (match[2] || match[3] || match[4] || '').trim()
    let body = match[5] || ''

    if (!question) {
      const bodyLines = body.split('\n')
      const firstLine = (bodyLines[0] || '').trim()
      if (firstLine && !firstLine.startsWith('- ') && !firstLine.startsWith('* ')) {
        question = firstLine
        body = bodyLines.slice(1).join('\n')
      }
    }

    const options = parsePollOptions(body)

    if (question && options.length >= 2) {
      const slug = (rawSlug || slugify(question) || `poll-${Date.now()}`).toLowerCase()
      segments.push({
        type: 'poll',
        data: {
          slug,
          question,
          options,
        },
      })
    } else {
      // Fallback: invalid poll format, treat as regular markdown
      segments.push({ type: 'markdown', content: fullMatch })
    }

    lastIndex = match.index + fullMatch.length
  }

  // Push remaining markdown content if any
  if (lastIndex < normalized.length) {
    const trailingMd = normalized.substring(lastIndex)
    if (trailingMd.trim() || segments.length === 0) {
      segments.push({ type: 'markdown', content: trailingMd })
    }
  }

  return segments.length > 0 ? segments : [{ type: 'markdown', content }]
}

/**
 * Formats a poll into the standard markdown syntax
 */
export function formatPollMarkdown(slug: string, question: string, options: ParsedPollOption[]): string {
  const cleanSlug = slugify(slug)
  const optionLines = options
    .filter((opt) => opt.text.trim())
    .map((opt) => {
      const optId = opt.id.trim() ? slugify(opt.id) : slugify(opt.text)
      return `- ${optId}: ${opt.text.trim()}`
    })
    .join('\n')

  return `:::poll:${cleanSlug} "${question.trim()}"\n${optionLines}\n:::`
}
