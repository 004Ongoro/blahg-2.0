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
        <div style="font-family: Arial, Helvetica, sans-serif; background: #f9fafb; padding: 20px;">
          
          <!-- MAIN WRAPPER -->
          <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 4px solid #000; box-shadow: 8px 8px 0px #000;">
            
            <!-- HEADER -->
            <div style="background: #000; color: #fff; padding: 24px; border-bottom: 4px solid #000;">
              <h1 style="margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px;">
                ${subject}
              </h1>

              <div style="margin-top: 10px;">
                <a href="${baseUrl}/newsletter/archive/${slug}" 
                  style="font-size: 12px; color: #fb923c; font-weight: bold; text-decoration: none; border-bottom: 2px solid #fb923c;">
                  VIEW IN BROWSER →
                </a>
              </div>
            </div>

            <!-- CONTENT -->
            <div style="padding: 30px; font-size: 17px; line-height: 1.7; color: #000;">
              ${processedContent}
            </div>

            <!-- CTA BLOCK -->
            <div style="margin: 0 30px 30px; border: 4px solid #000; padding: 20px; background: #fb923c;">
              <p style="margin: 0; font-weight: bold; font-size: 15px;">
                💬 Reply to this email — I actually read everything.
              </p>
            </div>

            <!-- SOCIALS -->
            <div style="padding: 0 30px 30px;">
              <p style="font-weight: bold; margin-bottom: 10px;">CONNECT</p>

              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                
                <a href="https://github.com/004Ongoro" 
                  style="border: 3px solid #000; padding: 10px 14px; text-decoration: none; color: #000; font-weight: bold; background: #fff;">
                  GITHUB ↗
                </a>

                <a href="https://x.com/ongorogeorg_e" 
                  style="border: 3px solid #000; padding: 10px 14px; text-decoration: none; color: #000; font-weight: bold; background: #fff;">
                  X ↗
                </a>

                <a href="https://linkedin.com/in/georgeongoro2" 
                  style="border: 3px solid #000; padding: 10px 14px; text-decoration: none; color: #000; font-weight: bold; background: #fff;">
                  LINKEDIN ↗
                </a>

              </div>
            </div>

            <!-- FOOTER -->
            <div style="background: #000; color: #fff; padding: 24px; border-top: 4px solid #000; font-size: 13px;">
              
              <p style="margin: 0 0 10px;">
                Sent by <strong>George Ongoro</strong>
              </p>

              <p style="margin: 0 0 15px;">
                dev.ongoro.top — building, breaking, learning.
              </p>

              <div style="margin-top: 10px;">
                <a href="${baseUrl}/newsletter" style="color: #fb923c; font-weight: bold; text-decoration: none;">
                  Subscribe
                </a>
                <span style="margin: 0 8px;">•</span>
                <a href="${baseUrl}/unsubscribe" style="color: #fff; text-decoration: underline;">
                  Unsubscribe
                </a>
              </div>

            </div>

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