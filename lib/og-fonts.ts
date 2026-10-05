import fs from 'node:fs/promises'
import path from 'node:path'

let cachedBold: ArrayBuffer | null = null
let cachedMedium: ArrayBuffer | null = null

export interface OgFontConfig {
  name: string
  data: ArrayBuffer
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  style: 'normal' | 'italic'
}

/**
 * Loads and caches Space Grotesk fonts from the local public/fonts directory.
 * Fast, lightweight, and offline with zero external network requests on Netlify free tier.
 */
export async function getOgFonts(): Promise<OgFontConfig[] | undefined> {
  if (cachedBold && cachedMedium) {
    return [
      { name: 'Space Grotesk', data: cachedBold, weight: 700, style: 'normal' },
      { name: 'Space Grotesk', data: cachedMedium, weight: 500, style: 'normal' },
    ]
  }

  try {
    const fontsDir = path.join(process.cwd(), 'public', 'fonts')
    const [boldBuffer, mediumBuffer] = await Promise.all([
      fs.readFile(path.join(fontsDir, 'SpaceGrotesk-Bold.ttf')),
      fs.readFile(path.join(fontsDir, 'SpaceGrotesk-Medium.ttf')),
    ])

    // Convert Node Buffer to ArrayBuffer
    cachedBold = boldBuffer.buffer.slice(
      boldBuffer.byteOffset,
      boldBuffer.byteOffset + boldBuffer.byteLength
    )
    cachedMedium = mediumBuffer.buffer.slice(
      mediumBuffer.byteOffset,
      mediumBuffer.byteOffset + mediumBuffer.byteLength
    )

    return [
      { name: 'Space Grotesk', data: cachedBold, weight: 700, style: 'normal' },
      { name: 'Space Grotesk', data: cachedMedium, weight: 500, style: 'normal' },
    ]
  } catch (error) {
    console.warn('[og-fonts] Failed to load local fonts, falling back to default system font:', error)
    return undefined
  }
}
