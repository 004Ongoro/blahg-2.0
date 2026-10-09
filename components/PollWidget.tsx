'use client'

import { useState, useEffect, useRef } from 'react'
import { BarChart2, Check, Loader2, Users, Eye, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBrowserFingerprint, getOrCreateVoterToken } from '@/lib/fingerprint'

export interface PollOption {
  id: string
  text: string
  votes?: number
}

export interface PollWidgetProps {
  slug: string
  question: string
  options: PollOption[]
  initialTotalVotes?: number
  initialIsClosed?: boolean
}

export function PollWidget({
  slug,
  question,
  options: initialOptions,
  initialTotalVotes,
  initialIsClosed,
}: PollWidgetProps) {
  const [options, setOptions] = useState<Array<{ id: string; text: string; votes: number }>>(() =>
    initialOptions.map((opt) => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes || 0,
    }))
  )
  const [totalVotes, setTotalVotes] = useState<number>(() => {
    if (typeof initialTotalVotes === 'number' && initialTotalVotes >= 0) {
      return initialTotalVotes
    }
    return initialOptions.reduce((acc, curr) => acc + (curr.votes || 0), 0)
  })
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null)
  const [submittingOptionId, setSubmittingOptionId] = useState<string | null>(null)
  const [isClosed, setIsClosed] = useState<boolean>(initialIsClosed ?? false)
  const [showResultsMode, setShowResultsMode] = useState<boolean>(false)
  const [hasMounted, setHasMounted] = useState<boolean>(false)

  // Local storage key for this poll
  const storageKey = `blahg_poll_voted_${slug}`
  const optionsKey = JSON.stringify(initialOptions)
  const fingerprintRef = useRef<string>('')
  const voterTokenRef = useRef<string>('')

  useEffect(() => {
    setHasMounted(true)

    // Check localStorage
    const savedVote = localStorage.getItem(storageKey)
    if (savedVote) {
      setVotedOptionId(savedVote)
    }

    // Sync with initial options
    setOptions(
      initialOptions.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes || 0,
      }))
    )

    if (typeof initialTotalVotes === 'number' && initialTotalVotes >= 0) {
      setTotalVotes(initialTotalVotes)
    }

    // Fetch live results from database using hardware fingerprint + persistent token
    const fetchPoll = async () => {
      try {
        let fp = fingerprintRef.current
        let vt = voterTokenRef.current

        if (!fp) {
          fp = await getBrowserFingerprint()
          vt = getOrCreateVoterToken()
          fingerprintRef.current = fp
          voterTokenRef.current = vt
        }

        const queryParams = new URLSearchParams({
          question,
          options: JSON.stringify(initialOptions.map((o) => ({ id: o.id, text: o.text }))),
          fp,
          vt,
          t: Date.now().toString(),
        })

        const res = await fetch(`/api/polls/${slug}?${queryParams.toString()}`, {
          cache: 'no-store',
          headers: {
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            'x-client-fingerprint': fp,
          },
        })

        if (res.ok) {
          const data = await res.json()
          if (data.poll && Array.isArray(data.poll.options) && data.poll.options.length > 0) {
            setOptions(data.poll.options)
            setTotalVotes(data.poll.totalVotes || 0)
            setIsClosed(Boolean(data.poll.isClosed))
          }
          if (data.hasVoted && !savedVote) {
            setVotedOptionId('recorded')
            localStorage.setItem(storageKey, 'recorded')
          }
        }
      } catch (err) {
        console.error('Failed to load poll results:', err)
      }
    }

    fetchPoll()
  }, [slug, question, optionsKey, storageKey, initialTotalVotes])

  const handleVote = async (optionId: string) => {
    if (votedOptionId || isClosed || submittingOptionId) return

    setSubmittingOptionId(optionId)

    // Optimistic UI update
    setVotedOptionId(optionId)
    localStorage.setItem(storageKey, optionId)
    setTotalVotes((prev) => prev + 1)
    setOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt))
    )

    try {
      let fp = fingerprintRef.current
      let vt = voterTokenRef.current

      if (!fp) {
        fp = await getBrowserFingerprint()
        vt = getOrCreateVoterToken()
        fingerprintRef.current = fp
        voterTokenRef.current = vt
      }

      const res = await fetch(`/api/polls/${slug}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId,
          question,
          options: initialOptions.map((o) => ({ id: o.id, text: o.text })),
          fingerprint: fp,
          voterToken: vt,
        }),
      })

      const data = await res.json()

      if (data.voterToken) {
        voterTokenRef.current = data.voterToken
        if (typeof window !== 'undefined') {
          localStorage.setItem('blahg_poll_voter_token', data.voterToken)
        }
      }

      if (res.ok && data.poll) {
        setOptions(data.poll.options)
        setTotalVotes(data.poll.totalVotes || 0)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('toast', {
              detail: { message: 'Vote recorded!', type: 'success' },
            })
          )
        }
      } else if (res.status === 409 && data.poll) {
        // Already voted on server (device fingerprint / cookie / IP match)
        setOptions(data.poll.options)
        setTotalVotes(data.poll.totalVotes || 0)
        setVotedOptionId('recorded')
        localStorage.setItem(storageKey, 'recorded')
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('toast', {
              detail: { message: 'A vote has already been recorded from this device', type: 'info' },
            })
          )
        }
      } else {
        // Server rejected vote - rollback optimistic state
        localStorage.removeItem(storageKey)
        setVotedOptionId(null)
        setTotalVotes((prev) => Math.max(0, prev - 1))
        setOptions((prev) =>
          prev.map((opt) => (opt.id === optionId ? { ...opt, votes: Math.max(0, (opt.votes || 0) - 1) } : opt))
        )
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('toast', {
              detail: { message: data.error || 'Failed to submit vote. Please try again.', type: 'error' },
            })
          )
        }
      }
    } catch (err) {
      console.error('Failed to submit vote:', err)
      // Rollback optimistic state
      localStorage.removeItem(storageKey)
      setVotedOptionId(null)
      setTotalVotes((prev) => Math.max(0, prev - 1))
      setOptions((prev) =>
        prev.map((opt) => (opt.id === optionId ? { ...opt, votes: Math.max(0, (opt.votes || 0) - 1) } : opt))
      )
    } finally {
      setSubmittingOptionId(null)
    }
  }

  const isVoted = Boolean(votedOptionId)
  const isViewingResults = isVoted || showResultsMode

  return (
    <div className="my-10 rounded-2xl border border-foreground/15 dark:border-white/10 bg-card/70 backdrop-blur-xs p-6 md:p-8 shadow-xs not-prose transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/15 text-accent font-mono text-[10px] font-extrabold uppercase tracking-widest border border-accent/20">
          <BarChart2 className="w-3 h-3" /> Reader Poll
        </span>

        <div className="flex items-center gap-2">
          {isClosed && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Closed
            </span>
          )}

          {!isVoted && !isClosed && (
            <button
              type="button"
              onClick={() => setShowResultsMode(!showResultsMode)}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-foreground/5"
            >
              {showResultsMode ? (
                <>
                  <ArrowLeft className="w-3 h-3" /> Vote
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> Results
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg md:text-xl font-sans font-black tracking-tight text-foreground leading-snug mb-6">
        {question}
      </h3>

      {/* Options List */}
      <div className="space-y-3">
        {options.map((option) => {
          const isUserChoice = votedOptionId === option.id
          const voteCount = option.votes || 0
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
          const isPending = submittingOptionId === option.id

          if (!hasMounted || !isViewingResults) {
            // Unvoted Interactive Button State
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleVote(option.id)}
                disabled={Boolean(submittingOptionId) || isClosed}
                className={cn(
                  'w-full text-left p-4 rounded-xl border font-sans text-sm font-semibold transition-all flex items-center justify-between group cursor-pointer',
                  'border-foreground/10 hover:border-accent hover:bg-accent/5 active:scale-[0.99]',
                  isPending && 'opacity-70 pointer-events-none'
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full border border-foreground/30 group-hover:border-accent flex items-center justify-center transition-colors shrink-0">
                    <span className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-foreground group-hover:text-accent transition-colors font-medium">
                    {option.text}
                  </span>
                </span>

                {isPending && <Loader2 className="w-4 h-4 animate-spin text-accent shrink-0" />}
              </button>
            )
          }

          // Voted / Results Progress Bar State
          return (
            <div
              key={option.id}
              className={cn(
                'relative overflow-hidden rounded-xl border p-4 transition-all',
                isUserChoice
                  ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                  : 'border-foreground/10 bg-background/50'
              )}
            >
              {/* Animated Background Percentage Fill */}
              <div
                className={cn(
                  'absolute inset-y-0 left-0 transition-all duration-700 ease-out',
                  isUserChoice ? 'bg-accent/25' : 'bg-foreground/5 dark:bg-white/5'
                )}
                style={{ width: `${percentage}%` }}
              />

              {/* Option Content Overlay */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      'text-sm font-bold truncate',
                      isUserChoice ? 'text-foreground' : 'text-foreground/90'
                    )}
                  >
                    {option.text}
                  </span>
                  {isUserChoice && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase tracking-wider text-accent bg-accent/15 px-2 py-0.5 rounded-full shrink-0 border border-accent/20">
                      <Check className="w-3 h-3" /> Your Vote
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className="font-extrabold text-foreground tabular-nums text-sm">
                    {percentage}%
                  </span>
                  <span className="text-muted-foreground/70 text-[11px] tabular-nums">
                    ({voteCount})
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 opacity-70" />
          <span className="font-semibold text-foreground">{totalVotes}</span>{' '}
          {totalVotes === 1 ? 'vote' : 'votes'}
        </span>

        {isVoted ? (
          <span className="text-[11px] font-semibold text-accent uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3 h-3" /> Response Recorded
          </span>
        ) : (
          !isClosed && (
            <button
              type="button"
              onClick={() => setShowResultsMode(!showResultsMode)}
              className="text-[11px] font-semibold text-muted-foreground hover:text-accent uppercase tracking-wider transition-colors cursor-pointer"
            >
              {showResultsMode ? '← Back to Vote' : 'View Results →'}
            </button>
          )
        )}
      </div>
    </div>
  )
}
