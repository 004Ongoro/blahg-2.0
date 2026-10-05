import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import NewsletterIssue from '@/models/NewsletterIssue'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await dbConnect()
    const issues = await NewsletterIssue.find({ published: true, isDraft: { $ne: true } })
      .sort({ createdAt: -1 })
      .select('subject slug createdAt isMarkdown')
      .lean()

    const formattedIssues = (issues as any[]).map((issue) => ({
      _id: issue._id.toString(),
      subject: issue.subject,
      slug: issue.slug,
      createdAt: issue.createdAt instanceof Date ? issue.createdAt.toISOString() : String(issue.createdAt),
      isMarkdown: Boolean(issue.isMarkdown),
    }))

    return NextResponse.json(
      { issues: formattedIssues },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error: any) {
    console.error('Failed to fetch newsletter issues:', error)
    return NextResponse.json(
      { issues: [], error: 'Failed to fetch newsletter issues' },
      { status: 500 }
    )
  }
}
