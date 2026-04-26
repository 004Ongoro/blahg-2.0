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

    const { subject, content, isMarkdown = true, publishToArchive = true, recipients } = await req.json()
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

    let recipientEmails: string[] = []
    
    if (recipients && Array.isArray(recipients) && recipients.length > 0) {
      recipientEmails = recipients
    } else {
      const subscribers = await Subscriber.find({ active: true })
      recipientEmails = subscribers.map((sub) => sub.email)
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 })
    }
    
    const processedContent = isMarkdown 
      ? await markdownToHtml(content)
      : `<div style="white-space: pre-wrap; font-family: sans-serif;">${content}</div>`

    const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .brutal-card {
              border: 4px solid #000;
              box-shadow: 8px 8px 0px #000;
              background: #fff;
              margin: 20px auto;
              max-width: 600px;
              font-family: 'Helvetica', 'Arial', sans-serif;
            }
            .header {
              background: #fb923c;
              padding: 30px;
              border-bottom: 4px solid #000;
            }
            .content {
              padding: 30px;
              color: #000;
              line-height: 1.6;
              font-size: 16px;
            }
            .footer {
              background: #000;
              color: #fff;
              padding: 30px;
              font-size: 12px;
            }
            .btn {
              display: inline-block;
              background: #fb923c;
              color: #000;
              text-decoration: none;
              padding: 12px 24px;
              font-weight: 900;
              text-transform: uppercase;
              border: 3px solid #000;
              box-shadow: 4px 4px 0px #000;
              margin-top: 20px;
            }
            .btn:hover {
              transform: translate(-2px, -2px);
              box-shadow: 6px 6px 0px #000;
            }
            a { color: #fb923c; text-decoration: underline; font-weight: bold; }
          </style>
        </head>
        <body style="background: #f0f0f0; padding: 20px;">
          <div class="brutal-card">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; line-height: 1;">
                ${subject}
              </h1>
              <div style="margin-top: 15px;">
                <a href="${baseUrl}/newsletter/archive/${slug}" style="color: #000; text-decoration: none; font-size: 12px; font-weight: 900; background: #fff; padding: 4px 8px; border: 2px solid #000;">
                  VIEW IN BROWSER ↗
                </a>
              </div>
            </div>
            
            <div class="content">
              ${processedContent}
            </div>

            <div style="padding: 0 30px 30px;">
              <div style="border: 4px solid #000; padding: 20px; background: #a78bfa;">
                <p style="margin: 0; font-weight: 900; text-transform: uppercase; font-size: 14px;">
                  Enjoying the content?
                </p>
                <p style="margin: 5px 0 0; font-size: 14px; font-weight: bold;">
                  Reply to this email — I read every single one.
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0; font-weight: 900; text-transform: uppercase; font-size: 14px; color: #fb923c;">
                George Ongoro
              </p>
              <p style="margin: 5px 0 20px; font-weight: bold;">
                Software Engineer & Maker
              </p>
              
              <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <a href="https://github.com/004Ongoro" style="color: #fff; margin-right: 15px;">GitHub</a>
                <a href="https://x.com/ongorogeorg_e" style="color: #fff; margin-right: 15px;">X / Twitter</a>
                <a href="https://linkedin.com/in/georgeongoro2" style="color: #fff;">LinkedIn</a>
              </div>

              <div style="border-top: 2px solid #333; pt-20px; margin-top: 20px; padding-top: 20px;">
                <p style="margin: 0; opacity: 0.8;">
                  You're receiving this because you're awesome and subscribed to my newsletter.
                </p>
                <p style="margin: 10px 0 0;">
                  <a href="${baseUrl}/unsubscribe" style="color: #ef4444;">Unsubscribe</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `

    // Implement controlled throughput with batching
    // CHUNK_SIZE of 45 ensures we stay well within Resend's 100 limit and handles Gmail more gently
    const CHUNK_SIZE = 45
    const DELAY_MS = 1000 // 1 second delay between batches
    
    let lastError = null

    // Chunk the recipients
    const chunks = []
    for (let i = 0; i < recipientEmails.length; i += CHUNK_SIZE) {
      chunks.push(recipientEmails.slice(i, i + CHUNK_SIZE))
    }

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const batchRequest = chunk.map(email => ({
        from: 'George Ongoro <george@ongoro.top>',
        to: email,
        subject: subject,
        html: emailHtml,
      }))

      const { error } = await resend.batch.send(batchRequest)
      
      if (error) {
        console.error(`Error sending newsletter batch ${i + 1}:`, error)
        lastError = error
      }

      // If there are more chunks, wait before sending the next one
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS))
      }
    }

    if (lastError && recipientEmails.length <= CHUNK_SIZE) {
      return NextResponse.json({ error: lastError.message }, { status: 400 })
    }

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