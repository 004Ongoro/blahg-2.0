import { NextRequest, NextResponse } from 'next/server'
import { fetchDotfileContent } from '@/lib/github'

export const revalidate = 3600 // Cache for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileKey = searchParams.get('file')

  if (!fileKey) {
    return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
  }

  try {
    const content = await fetchDotfileContent(fileKey)
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch dotfile' }, { status: 400 })
  }
}

