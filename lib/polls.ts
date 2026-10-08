import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import Poll, { IPollOption } from '@/models/Poll'
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
export const POLL_BLOCK_REGEX = /:::poll(?::([a-zA-Z0-9_-]+))?(?:\s+(?:"([^"\n]+)"|'([^'\n]+)'|([^\n]+)))?\n([\s\S]*?)\n:::/g

/**
 * Parses the body text of a poll into structured options
 */
export function parsePollOptions(body: string): ParsedPollOption[] {
  const lines = body.split('\n')
  const options: ParsedPollOption[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line.startsWith('- ') && !line.startsWith('* ')) continue

    const content = line.substring(2).trim()
    if (!content) continue

    // Check for explicit "slug: Option text" format
    const colonMatch = content.match(/^([a-zA-Z0-9_-]+):\s*(.+)$/)
    if (colonMatch) {
      const optionId = colonMatch[1].trim().toLowerCase()
      const text = colonMatch[2].trim()
      if (optionId && text) {
        options.push({ id: optionId, text })
      }
    } else {
      // Auto-generate option slug from text
      const optionId = slugify(content) || `opt-${options.length + 1}`
      options.push({ id: optionId, text: content })
    }
  }

  return options
}

/**
 * Parses a single :::poll ... ::: block string into a ParsedPoll object
 */
export function parsePollBlock(blockText: string): ParsedPoll | null {
  const match = /:::poll(?::([a-zA-Z0-9_-]+))?(?:\s+(?:"([^"\n]+)"|'([^'\n]+)'|([^\n]+)))?\n([\s\S]*?)\n:::/.exec(blockText)
  if (!match) return null

  const rawSlug = match[1]?.trim()
  const question = (match[2] || match[3] || match[4] || '').trim()
  const body = match[5] || ''

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

  const segments: ContentSegment[] = []
  let lastIndex = 0

  const regex = new RegExp(POLL_BLOCK_REGEX)
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    const matchIndex = match.index
    const matchLength = match[0].length

    // Push preceding markdown segment if any
    if (matchIndex > lastIndex) {
      const mdContent = content.substring(lastIndex, matchIndex)
      if (mdContent.trim()) {
        segments.push({ type: 'markdown', content: mdContent })
      }
    }

    const rawSlug = match[1]?.trim()
    const question = (match[2] || match[3] || match[4] || '').trim()
    const body = match[5] || ''
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
      segments.push({ type: 'markdown', content: match[0] })
    }

    lastIndex = matchIndex + matchLength
  }

  // Push remaining markdown content if any
  if (lastIndex < content.length) {
    const trailingMd = content.substring(lastIndex)
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

/**
 * Computes a privacy-respecting one-way SHA-256 hash for a client IP
 */
export function generateVoterHash(clientIp: string, pollSlug: string): string {
  const salt = process.env.POLL_SALT || 'blahg-poll-voter-salt-2026'
  return crypto
    .createHash('sha256')
    .update(`${clientIp}:${pollSlug}:${salt}`)
    .digest('hex')
}

/**
 * Extracts and upserts all polls found in markdown content into MongoDB
 */
export async function syncPollsFromContent(content: string, postSlug?: string): Promise<void> {
  try {
    const segments = splitContentWithPolls(content)
    const pollSegments = segments.filter((s): s is { type: 'poll'; data: ParsedPoll } => s.type === 'poll')

    if (pollSegments.length === 0) return

    await dbConnect()

    for (const { data } of pollSegments) {
      const existing = await Poll.findOne({ slug: data.slug })

      if (!existing) {
        // Initialize new poll with 0 votes for each option
        const initialOptions: IPollOption[] = data.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          votes: 0,
        }))

        await Poll.create({
          slug: data.slug,
          question: data.question,
          options: initialOptions,
          voterHashes: [],
          totalVotes: 0,
          postSlug,
        })
      } else {
        // Preserve existing vote counts while updating questions/labels or adding new options
        const existingOptionVotes = new Map<string, number>()
        for (const opt of existing.options) {
          existingOptionVotes.set(opt.id, opt.votes || 0)
        }

        const mergedOptions: IPollOption[] = data.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          votes: existingOptionVotes.get(opt.id) || 0,
        }))

        const totalVotes = mergedOptions.reduce((acc, curr) => acc + curr.votes, 0)

        await Poll.updateOne(
          { slug: data.slug },
          {
            $set: {
              question: data.question,
              options: mergedOptions,
              totalVotes,
              ...(postSlug ? { postSlug } : {}),
            },
          }
        )
      }
    }
  } catch (error) {
    console.error('Error syncing polls from content:', error)
  }
}
