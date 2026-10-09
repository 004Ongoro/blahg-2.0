import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import Poll from '@/models/Poll'
import { generateVoterHash } from '@/lib/polls-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params
    const cleanSlug = slug.toLowerCase().trim()

    const body = await request.json()
    const { optionId, question, options } = body

    if (!optionId || typeof optionId !== 'string') {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 })
    }

    // Extract client IP (supports standard, Netlify, and local proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const clientIpHeader = request.headers.get('client-ip') || request.headers.get('x-nf-client-connection-ip')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (clientIpHeader?.trim() || '127.0.0.1')
    const voterHash = generateVoterHash(ip, cleanSlug)

    let poll = await Poll.findOne({ slug: cleanSlug })

    // Auto-create poll if not yet in DB
    if (!poll) {
      if (!question || !Array.isArray(options) || options.length < 2) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
      }

      poll = await Poll.create({
        slug: cleanSlug,
        question,
        options: options.map((opt: { id: string; text: string }) => ({
          id: opt.id,
          text: opt.text,
          votes: 0,
        })),
        voterHashes: [],
        totalVotes: 0,
      })
    }

    if (poll.isClosed) {
      return NextResponse.json({ error: 'This poll is closed' }, { status: 400 })
    }

    // Check if voter hash already recorded
    if (poll.voterHashes.includes(voterHash)) {
      return NextResponse.json(
        {
          error: 'You have already voted in this poll',
          alreadyVoted: true,
          poll: {
            slug: poll.slug,
            question: poll.question,
            options: poll.options.map((opt) => ({
              id: opt.id,
              text: opt.text,
              votes: opt.votes || 0,
            })),
            totalVotes: poll.totalVotes || 0,
            isClosed: poll.isClosed,
          },
        },
        { status: 409 }
      )
    }

    // Verify option exists
    const optionExists = poll.options.some((opt) => opt.id === optionId)
    if (!optionExists) {
      return NextResponse.json({ error: 'Invalid option selected' }, { status: 400 })
    }

    // Atomic increment
    const updated = await Poll.findOneAndUpdate(
      {
        slug: cleanSlug,
        'options.id': optionId,
        voterHashes: { $ne: voterHash },
      },
      {
        $inc: { 'options.$.votes': 1, totalVotes: 1 },
        $push: { voterHashes: voterHash },
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to record vote or already voted' },
        { status: 409 }
      )
    }

    // Revalidate ISR cached pages if associated with a post
    if (updated.postSlug) {
      revalidatePath(`/post/${updated.postSlug}`)
      revalidatePath(`/note/${updated.postSlug}`)
    } else {
      const referer = request.headers.get('referer')
      if (referer) {
        try {
          const url = new URL(referer)
          revalidatePath(url.pathname)
        } catch {
          // Ignore
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        votedOptionId: optionId,
        poll: {
          slug: updated.slug,
          question: updated.question,
          options: updated.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            votes: opt.votes,
          })),
          totalVotes: updated.totalVotes,
          isClosed: updated.isClosed,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}
