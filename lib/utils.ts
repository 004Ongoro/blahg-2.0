import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.URL) return process.env.URL // Netlify
  return 'https://code.geohack.top'
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function addTrackingParams(url: string, params: Record<string, string>): string {
  try {
    // Check if it's a relative URL
    const isRelative = !url.startsWith('http') && !url.startsWith('//')
    const base = 'https://dummy.com'
    const urlObj = new URL(url, isRelative ? base : undefined)
    
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value)
    })
    
    return isRelative 
      ? urlObj.pathname + urlObj.search + urlObj.hash
      : urlObj.toString()
  } catch (e) {
    return url
  }
}
