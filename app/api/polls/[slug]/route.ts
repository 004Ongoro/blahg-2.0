import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Poll from '@/models/Poll'
import { getVoterIdentityHashes, hasAlreadyVoted } from '@/lib/polls-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params
    const cleanSlug = slug.toLowerCase().trim()

    let poll = await Poll.findOne({ slug: cleanSlug }).lean()

    // Extract client IP and fingerprint parameters
    const forwarded = request.headers.get('x-forwarded-for')
    const clientIpHeader = request.headers.get('client-ip') || request.headers.get('x-nf-client-connection-ip')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (clientIpHeader?.trim() || '127.0.0.1')

    const searchParams = request.nextUrl.searchParams
    const fingerprint = searchParams.get('fp') || request.headers.get('x-client-fingerprint')
    const voterToken =
      searchParams.get('vt') ||
      request.cookies.get('blahg_poll_vid')?.value ||
      request.cookies.get('blahg_poll_voter_token')?.value

    const identity = getVoterIdentityHashes({
      ip,
      fingerprint,
      voterToken,
      pollSlug: cleanSlug,
    })

    if (!poll) {
      // Check if client provided fallback question/options for just-in-time initialization
      const searchParams = request.nextUrl.searchParams
      const question = searchParams.get('question')
      const optionsJson = searchParams.get('options')

      if (question && optionsJson) {
        try {
          const rawOptions = JSON.parse(optionsJson) as Array<{ id: string; text: string }>
          if (Array.isArray(rawOptions) && rawOptions.length >= 2) {
            const newPoll = await Poll.create({
              slug: cleanSlug,
              question,
              options: rawOptions.map((opt) => ({
                id: opt.id,
                text: opt.text,
                votes: 0,
              })),
              voterHashes: [],
              totalVotes: 0,
            })
            poll = newPoll.toObject()
          }
        } catch {
          // If JSON parse fails, return 404
        }
      }

      if (!poll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
      }
    }

    const hasVoted = hasAlreadyVoted(poll.voterHashes, identity)

    return NextResponse.json(
      {
        poll: {
          slug: poll.slug,
          question: poll.question,
          options: poll.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            votes: opt.votes || 0,
          })),
          totalVotes: poll.totalVotes || 0,
          isClosed: poll.isClosed || false,
        },
        hasVoted,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 })
  }
}
