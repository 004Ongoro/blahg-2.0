'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const GLYPHS = [
  '0', '1', '{', '}', '<', '>', '/', '\\', 'λ', 'Σ', 'α', 'β', 'γ', 'π',
  '∞', '∑', '√', '∆', '░', '▒', '▓', '⚡', '⌘', '★', '✦', '✧', '⬡', '⚙', '◈',
  '=', '!=', ':', ';', '->', '=>', '&', '|', '^', '%', '#', '@', '*', '?', '$',
  '0x', '::', '[]', '()', '&&', '||', '++', '--', '+=', '-='
]

export function FallingGlyphs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Honor reduced motion settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const columnSpacing = 32 // Spacing out columns for subtle, minimal look
    const fontSize = 13
    
    interface Column {
      x: number
      y: number
      speed: number
      opacity: number
      glyph: string
      changeTimer: number
      changeInterval: number
    }

    const createColumns = (): Column[] => {
      const colCount = Math.floor(width / columnSpacing)
      const cols: Column[] = []
      for (let i = 0; i < colCount; i++) {
        cols.push({
          x: i * columnSpacing + columnSpacing / 2,
          y: Math.random() * -height * 1.5, // Spread initial positions above screen
          speed: 0.2 + Math.random() * 0.5, // Slow, ambient falling speed
          opacity: 0.04 + Math.random() * 0.08, // Very subtle, low contrast
          glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          changeTimer: 0,
          changeInterval: Math.floor(30 + Math.random() * 90),
        })
      }
      return cols
    }

    let columns = createColumns()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = createColumns()
    }

    window.addEventListener('resize', handleResize)

    let lastTime = performance.now()

    const draw = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      ctx.clearRect(0, 0, width, height)

      // Fetch dynamic colors based on current theme class
      const isDark = document.documentElement.classList.contains('dark') || resolvedTheme === 'dark'
      // Wheat (#efd6ac) for dark mode background, Ink Black (#04151f) for light mode background
      const colorRgb = isDark ? '239, 214, 172' : '4, 21, 31'

      ctx.font = `${fontSize}px var(--font-mono), monospace`
      ctx.textAlign = 'center'

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]

        // Main glyph
        ctx.fillStyle = `rgba(${colorRgb}, ${col.opacity})`
        ctx.fillText(col.glyph, col.x, col.y)

        // Subtle trail element (fainter glyph above main)
        if (col.y > fontSize * 2) {
          ctx.fillStyle = `rgba(${colorRgb}, ${col.opacity * 0.35})`
          const prevGlyph = GLYPHS[(i * 3 + Math.floor(col.y / 40)) % GLYPHS.length]
          ctx.fillText(prevGlyph, col.x, col.y - fontSize * 1.6)
        }

        // Move down
        col.y += col.speed * (delta * 60)

        // Morph glyph character periodically
        col.changeTimer++
        if (col.changeTimer >= col.changeInterval) {
          col.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          col.changeTimer = 0
        }

        // Reset column when it goes off screen
        if (col.y > height + 40) {
          col.y = -20 - Math.random() * 150
          col.speed = 0.2 + Math.random() * 0.5
          col.opacity = 0.04 + Math.random() * 0.08
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full select-none opacity-80"
    />
  )
}
