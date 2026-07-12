'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, Zap, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostReactionsProps {
  slug: string
  initialReactions: Record<string, number>
}

const REACTION_TYPES = [
  { id: 'like', icon: ThumbsUp, label: 'Cool', color: 'bg-blue-500' },
  { id: 'mindblown', icon: Zap, label: 'Zap', color: 'bg-yellow-500' },
  { id: 'rocket', icon: Rocket, label: 'Ship It', color: 'bg-purple-500' },
]

export function PostReactions({ slug, initialReactions }: PostReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions)
  const [reacted, setReacted] = useState<Record<string, boolean>>({})
  const [animating, setAnimating] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`reacted-${slug}`)
    if (stored) {
      setReacted(JSON.parse(stored))
    }

    const controller = new AbortController()
    const fetchReactions = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}/react`, {
          signal: controller.signal
        })
        if (res.ok) {
          const data = await res.json()
          setReactions(data.reactions)
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to fetch reactions', err)
        }
      }
    }

    fetchReactions()
    return () => controller.abort()
  }, [slug])

  const handleReact = async (type: string) => {
    if (reacted[type]) return

    setAnimating(type)
    setTimeout(() => setAnimating(null), 1000)

    try {
      const res = await fetch(`/api/posts/${slug}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (res.ok) {
        const data = await res.json()
        setReactions(data.reactions)
        
        const newReacted = { ...reacted, [type]: true }
        setReacted(newReacted)
        localStorage.setItem(`reacted-${slug}`, JSON.stringify(newReacted))
      }
    } catch (err) {
      console.error('Failed to react', err)
    }
  }

  return (
    <div className="border border-foreground/5 bg-card p-8 mb-16">
      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 0.8s ease-out forwards;
        }
      `}</style>
      <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-6">
        Enjoyed this?
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {REACTION_TYPES.map((type) => {
          const Icon = type.icon
          const count = reactions[type.id] || 0
          const hasReacted = reacted[type.id]
          const isAnimating = animating === type.id

          return (
            <button
              key={type.id}
              onClick={() => handleReact(type.id)}
              disabled={hasReacted}
              className={cn(
                "group relative flex items-center gap-2 px-4 py-2 border transition-all text-sm font-medium",
                hasReacted 
                  ? "bg-foreground text-background cursor-default" 
                  : "bg-background hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-x-[0] active:translate-y-[0] active:shadow-none"
              )}
            >
              <Icon className={cn("w-4 h-4", isAnimating && "animate-bounce")} />
              <span className="uppercase text-[10px] tracking-widest">{type.label}</span>
              <span className="ml-1 opacity-40 tabular-nums">
                {count}
              </span>

              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Icon className={cn("w-6 h-6 p-1 rounded-full text-white animate-float-up", type.color)} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
