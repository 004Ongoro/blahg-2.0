import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import NewsletterIssue from '@/models/NewsletterIssue'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const resend = new Resend(process.env.RESEND_API_KEY)

async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  return result.toString()
}

/**
 * GET: Fetch all newsletter issues for admin management
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    // Fetch all issues, sorted by newest first
    const issues = await NewsletterIssue.find({}).sort({ createdAt: -1 }).lean()
    
    return NextResponse.json(issues)
  } catch (error) {
    console.error('Fetch Archive Error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

/**
 * POST: Blast a new newsletter and save to archive
 */
export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { subject, content, isMarkdown = true, publishToArchive = true } = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.ongoro.top'
    const slug = `${slugify(subject)}-${Date.now()}`

    await dbConnect()
    
    // Save to database first so the slug is reserved and "View in Browser" link works
    const issue = await NewsletterIssue.create({
      subject,
      content,
      isMarkdown,
      slug,
      published: publishToArchive
    })

    const subscribers = await Subscriber.find({ active: true })
    const recipientEmails = subscribers.map((sub) => sub.email)
    
    const processedContent = isMarkdown 
      ? await markdownToHtml(content)
      : `<div style="white-space: pre-wrap; font-family: sans-serif;">${content}</div>`

    // Send via Resend
    const { error } = await resend.emails.send({
      from: 'George Ongoro <george@ongoro.top>',
      to: 'george@ongoro.top',
      bcc: recipientEmails,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; background: #fff;">
          <div style="background: #fb923c; padding: 20px; border-bottom: 4px solid #000; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">${subject}</h1>
            <a href="${baseUrl}/newsletter/archive/${slug}" style="font-size: 12px; color: #000; font-weight: bold;">View in Browser</a>
          </div>
          <div style="padding: 30px; font-size: 18px; line-height: 1.6;">
            ${processedContent}
          </div>
          <div style="padding: 30px; background: #f3f4f6; border-top: 4px solid #000; font-size: 14px;">
            <p><strong>Note:</strong> You can reply to this email directly! I read every single reply and will get back to you personally.</p>
            <hr style="border: 1px solid #000; margin: 20px 0;" />
            <p>Sent from <strong>George Ongoro</strong> to subscribers of <strong>dev.ongoro.top</strong>.</p>
            <p>
              Not a subscriber? <a href="${baseUrl}/newsletter" style="color: #fb923c; font-weight: bold;">Subscribe here</a>.
              <br />
              Need to leave? <a href="${baseUrl}/unsubscribe" style="color: #000;">Unsubscribe here</a>.
            </p>
          </div>
        </div>
      `,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true, slug: issue.slug })
  } catch (error: any) {
    console.error('Newsletter Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * DELETE: Remove an issue from the archive
 */
export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await dbConnect()
  await NewsletterIssue.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}