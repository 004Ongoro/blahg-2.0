'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { triggerSpainConfetti } from '@/lib/confetti'

export function SpainCelebration() {
  const { theme } = useTheme()
  const prevTheme = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (theme === 'spain' && prevTheme.current !== 'spain') {
      triggerSpainConfetti()
      toast.success('🏆 World Cup Champions 2026!', {
        description: '¡Viva España! Spanish Victory mode activated.',
        duration: 4500,
      })
    }
    prevTheme.current = theme
  }, [theme])

  if (theme !== 'spain') return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30 select-none">
      <div className="absolute top-10 left-10 text-yellow-400/30 text-xs animate-bounce delay-100">⭐</div>
      <div className="absolute top-1/4 right-12 text-amber-300/30 text-sm animate-pulse delay-300">🏆</div>
      <div className="absolute bottom-20 left-1/3 text-red-500/30 text-xs animate-bounce delay-700">⚽</div>
      <div className="absolute top-2/3 right-1/4 text-yellow-400/30 text-xs animate-pulse delay-500">⭐</div>
      <div className="absolute top-1/2 left-8 text-amber-400/20 text-sm animate-pulse delay-1000">🇪🇸</div>
    </div>
  )
}
