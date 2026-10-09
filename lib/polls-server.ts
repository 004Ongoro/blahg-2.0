import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import Poll, { IPollOption } from '@/models/Poll'
import { splitContentWithPolls, ParsedPoll } from '@/lib/polls'

/**
 * Computes a privacy-respecting one-way SHA-256 hash for any voter identifier
 */
export function generateVoterHash(rawIdentifier: string, pollSlug: string): string {
  const salt = process.env.POLL_SALT || 'blahg-poll-voter-salt-2026'
  return crypto
    .createHash('sha256')
    .update(`${rawIdentifier}:${pollSlug}:${salt}`)
    .digest('hex')
}

export interface VoterIdentityParams {
  ip: string
  fingerprint?: string | null
  voterToken?: string | null
  pollSlug: string
}

export interface VoterHashesResult {
  deviceHash?: string
  networkDeviceHash?: string
  cookieHash?: string
  legacyIpHash: string
  allActiveHashes: string[]
}

/**
 * Computes multiple layers of fingerprint hashes to ensure 1 user = 1 vote.
 * Survives cache clearing, incognito browsing, and local cookie erasure.
 */
export function getVoterIdentityHashes({
  ip,
  fingerprint,
  voterToken,
  pollSlug,
}: VoterIdentityParams): VoterHashesResult {
  const cleanIp = (ip || '127.0.0.1').trim()
  const cleanSlug = pollSlug.toLowerCase().trim()

  const deviceHash =
    fingerprint && fingerprint.length >= 10
      ? generateVoterHash(`dev:${fingerprint.trim()}`, cleanSlug)
      : undefined

  const networkDeviceHash =
    fingerprint && fingerprint.length >= 10
      ? generateVoterHash(`netdev:${cleanIp}:${fingerprint.trim()}`, cleanSlug)
      : undefined

  const cookieHash =
    voterToken && voterToken.length >= 8
      ? generateVoterHash(`token:${voterToken.trim()}`, cleanSlug)
      : undefined

  const legacyIpHash = generateVoterHash(cleanIp, cleanSlug)

  const activeHashes = [deviceHash, networkDeviceHash, cookieHash].filter((h): h is string => Boolean(h))

  // If no device fingerprint is available, fall back to IP hash
  if (activeHashes.length === 0) {
    activeHashes.push(legacyIpHash)
  }

  return {
    deviceHash,
    networkDeviceHash,
    cookieHash,
    legacyIpHash,
    allActiveHashes: Array.from(new Set(activeHashes)),
  }
}

/**
 * Checks whether any of the voter's active identity hashes or legacy IP hashes
 * match existing records in the poll's voterHashes array.
 */
export function hasAlreadyVoted(
  existingVoterHashes: string[] | undefined,
  identity: VoterHashesResult
): boolean {
  if (!Array.isArray(existingVoterHashes) || existingVoterHashes.length === 0) {
    return false
  }

  // 1. Check strong hardware fingerprint
  if (identity.deviceHash && existingVoterHashes.includes(identity.deviceHash)) {
    return true
  }

  // 2. Check persistent cookie / voter token
  if (identity.cookieHash && existingVoterHashes.includes(identity.cookieHash)) {
    return true
  }

  // 3. Check network-device composite
  if (identity.networkDeviceHash && existingVoterHashes.includes(identity.networkDeviceHash)) {
    return true
  }

  // 4. Fallback check for legacy records (when no hardware fingerprint was stored)
  if (
    !identity.deviceHash &&
    !identity.cookieHash &&
    existingVoterHashes.includes(identity.legacyIpHash)
  ) {
    return true
  }

  return false
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
