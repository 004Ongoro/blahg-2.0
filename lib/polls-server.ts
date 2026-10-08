import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import Poll, { IPollOption } from '@/models/Poll'
import { splitContentWithPolls, ParsedPoll } from '@/lib/polls'

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
