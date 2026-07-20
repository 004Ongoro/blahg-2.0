'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { triggerSpainConfetti } from '@/lib/confetti'

interface TrailParticle {
  x: number
  y: number
  size: number
  color: string
  alpha: number
  vx: number
  vy: number
}

export function SpainCelebration() {
  const { theme } = useTheme()
  const prevTheme = useRef<string | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

  // Subtle Mouse Trail
  useEffect(() => {
    if (theme !== 'spain') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: TrailParticle[] = []
    let lastTime = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const colors = ['#FFC400', '#C60B1E', '#FFD700', '#FFFFFF']

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastTime < 30) return // Throttle creation rate
      lastTime = now

      particles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.55,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 + 0.3,
      })

      if (particles.length > 25) {
        particles.shift()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.035
        p.size *= 0.95

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [theme])

  if (theme !== 'spain') return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40 select-none"
      />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30 select-none">
        <div className="absolute top-10 left-10 text-yellow-400/30 text-xs animate-bounce delay-100">⭐</div>
        <div className="absolute top-1/4 right-12 text-amber-300/30 text-sm animate-pulse delay-300">🏆</div>
        <div className="absolute bottom-20 left-1/3 text-red-500/30 text-xs animate-bounce delay-700">⚽</div>
        <div className="absolute top-2/3 right-1/4 text-yellow-400/30 text-xs animate-pulse delay-500">⭐</div>
        <div className="absolute top-1/2 left-8 text-amber-400/20 text-sm animate-pulse delay-1000">🇪🇸</div>
      </div>
    </>
  )
}
