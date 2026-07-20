export function triggerSpainConfetti() {
  if (typeof window === 'undefined') return

  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = (canvas.width = window.innerWidth)
  const height = (canvas.height = window.innerHeight)

  // Spanish Flag & Championship Trophy Palette
  const colors = ['#C60B1E', '#FFC400', '#FFFFFF', '#E60000', '#FFD700', '#8B0000']
  
  const particles = Array.from({ length: 110 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.4 - height * 0.2,
    vx: (Math.random() - 0.5) * 7,
    vy: Math.random() * 4 + 2,
    size: Math.random() * 9 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    vRot: (Math.random() - 0.5) * 12,
    shape: Math.random() > 0.35 ? 'rect' : 'star',
  }))

  const startTime = Date.now()
  function animate() {
    const elapsed = Date.now() - startTime
    if (elapsed > 3500) {
      canvas.remove()
      return
    }

    ctx?.clearRect(0, 0, width, height)

    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.vRot
      p.vy += 0.08 // gravity

      if (!ctx) return
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = p.color

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4)
      } else {
        // Draw 5-point star
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(
            Math.cos(((18 + i * 72) * Math.PI) / 180) * p.size,
            -Math.sin(((18 + i * 72) * Math.PI) / 180) * p.size
          )
          ctx.lineTo(
            Math.cos(((54 + i * 72) * Math.PI) / 180) * (p.size / 2),
            -Math.sin(((54 + i * 72) * Math.PI) / 180) * (p.size / 2)
          )
        }
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    })

    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}
