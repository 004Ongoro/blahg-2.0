/**
 * Client-Side Browser & Hardware Fingerprinting Utility
 *
 * Generates a stable, privacy-friendly hardware/browser fingerprint without external dependencies.
 * Uses a combination of:
 * - 2D Canvas complex rendering (GPU font rasterization & anti-aliasing)
 * - WebGL unmasked GPU vendor & renderer strings
 * - Web Audio DynamicsCompressor frequency response
 * - Hardware concurrency (CPU cores), device memory, touch points
 * - Screen dimensions, color depth, pixel ratio
 * - Timezone, timezone offset, language, platform
 *
 * This fingerprint persists across:
 * - Clearing browser cache / localStorage
 * - Incognito / Private browsing windows
 * - Normal tab closures
 */

// Simple FNV-1a 32-bit hash function for fast string hashing
function fnv1a(str: string): string {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

/**
 * 2D Canvas Fingerprinting
 * Renders diverse Unicode, emoji, font families, and geometric shapes with alpha blending.
 * The resulting pixel data varies by OS subpixel rendering, font engines, and graphics drivers.
 */
function getCanvasFingerprint(): string {
  try {
    if (typeof document === 'undefined') return ''
    const canvas = document.createElement('canvas')
    canvas.width = 240
    canvas.height = 60
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // Background block
    ctx.textBaseline = 'top'
    ctx.font = "14px 'Arial', 'Helvetica', 'Times New Roman', sans-serif"
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)

    // Emoji + Unicode rendering (triggers OS-level font glyph fallbacks)
    ctx.fillStyle = '#069'
    ctx.fillText('BlahgPoll,\ud83d\ude03 \u2764\ufe0f \ud83c\udf0d \u2601\ufe0f', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('CanvasFP 1.0! <>?~&', 4, 38)

    // Radial gradient & composite shape (tests GPU blending arithmetic)
    const radgrad = ctx.createRadialGradient(50, 50, 10, 50, 50, 40)
    radgrad.addColorStop(0, '#ff0000')
    radgrad.addColorStop(0.5, '#00ff00')
    radgrad.addColorStop(1, '#0000ff')
    ctx.fillStyle = radgrad
    ctx.beginPath()
    ctx.arc(50, 50, 40, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()

    return fnv1a(canvas.toDataURL())
  } catch {
    return 'c_none'
  }
}

/**
 * WebGL GPU Fingerprinting
 * Queries the underlying graphics card hardware and driver information.
 */
function getWebGLFingerprint(): string {
  try {
    if (typeof document === 'undefined') return ''
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return 'gl_none'

    const dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const vendor = dbgRenderInfo ? gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)
    const renderer = dbgRenderInfo ? gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0
    const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0

    return fnv1a(`${vendor}~${renderer}~${maxTextureSize}~${maxRenderBufferSize}`)
  } catch {
    return 'gl_err'
  }
}

/**
 * Web Audio Fingerprinting
 * Measures floating-point rounding differences in OS/hardware audio synthesis.
 */
async function getAudioFingerprint(): Promise<string> {
  try {
    if (typeof window === 'undefined') return ''
    const AudioContextClass =
      window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext
    if (!AudioContextClass) return 'au_none'

    const context = new AudioContextClass(1, 44100, 44100)
    const oscillator = context.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(10000, context.currentTime)

    const compressor = context.createDynamicsCompressor()
    compressor.threshold.setValueAtTime(-50, context.currentTime)
    compressor.knee.setValueAtTime(40, context.currentTime)
    compressor.ratio.setValueAtTime(12, context.currentTime)
    compressor.attack.setValueAtTime(0, context.currentTime)
    compressor.release.setValueAtTime(0.25, context.currentTime)

    oscillator.connect(compressor)
    compressor.connect(context.destination)
    oscillator.start(0)

    // Render with 300ms timeout safeguard
    const renderPromise = context.startRendering()
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 300))
    const renderedBuffer = await Promise.race([renderPromise, timeoutPromise])

    if (!renderedBuffer) return 'au_timeout'

    const output = renderedBuffer.getChannelData(0)
    let sum = 0
    for (let i = 4500; i < 5000; i++) {
      sum += Math.abs(output[i] || 0)
    }
    return fnv1a(sum.toString())
  } catch {
    return 'au_err'
  }
}

/**
 * Hardware, Display & Environment Signals
 */
function getHardwareSignals(): string {
  if (typeof window === 'undefined') return ''
  const nav = window.navigator as unknown as {
    hardwareConcurrency?: number
    deviceMemory?: number
    maxTouchPoints?: number
    language?: string
    platform?: string
  }
  const scr = window.screen

  const screenRes = scr ? `${scr.width}x${scr.height}x${scr.colorDepth}` : ''
  const pixelRatio = window.devicePixelRatio || 1
  const timezone = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || ''
  const tzOffset = new Date().getTimezoneOffset()
  const cores = nav?.hardwareConcurrency || 0
  const memory = nav?.deviceMemory || 0
  const touchPoints = nav?.maxTouchPoints || 0
  const language = nav?.language || ''
  const platform = nav?.platform || ''

  return [screenRes, pixelRatio, timezone, tzOffset, cores, memory, touchPoints, language, platform].join(';')
}

/**
 * Computes a robust composite SHA-256 fingerprint for the current device/browser.
 */
export async function getBrowserFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return ''

  try {
    const [canvasHash, webglHash, audioHash] = await Promise.all([
      Promise.resolve(getCanvasFingerprint()),
      Promise.resolve(getWebGLFingerprint()),
      getAudioFingerprint(),
    ])

    const hardwareSignals = getHardwareSignals()
    const rawFingerprintPayload = `cv:${canvasHash}|gl:${webglHash}|au:${audioHash}|hw:${hardwareSignals}`

    // Compute SHA-256 via SubtleCrypto if available
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(rawFingerprintPayload)
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }

    // Fallback: double FNV-1a
    return `fp_${fnv1a(rawFingerprintPayload)}_${fnv1a(rawFingerprintPayload.split('').reverse().join(''))}`
  } catch (err) {
    console.error('Error generating device fingerprint:', err)
    return `fp_fallback_${Date.now()}`
  }
}

const VOTER_TOKEN_KEY = 'blahg_poll_voter_token'

/**
 * Gets or creates a persistent client-side voter token (stored in localStorage & cookie)
 */
export function getOrCreateVoterToken(): string {
  if (typeof window === 'undefined') return ''

  try {
    // 1. Try localStorage
    let token = localStorage.getItem(VOTER_TOKEN_KEY)
    if (token && token.length >= 16) {
      return token
    }

    // 2. Try cookie
    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${VOTER_TOKEN_KEY}=([^;]*)`))
    if (cookieMatch && cookieMatch[1]) {
      token = decodeURIComponent(cookieMatch[1])
      localStorage.setItem(VOTER_TOKEN_KEY, token)
      return token
    }

    // 3. Generate new persistent token
    const randomHex = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    token = `vtr_${Date.now().toString(36)}_${randomHex}`

    localStorage.setItem(VOTER_TOKEN_KEY, token)
    document.cookie = `${VOTER_TOKEN_KEY}=${token}; path=/; max-age=31536000; SameSite=Lax`

    return token
  } catch {
    return ''
  }
}
