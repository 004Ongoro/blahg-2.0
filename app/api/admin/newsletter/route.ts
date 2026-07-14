import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import NewsletterIssue from '@/models/NewsletterIssue'
import { getSession } from '@/lib/auth'
import { slugify, addTrackingParams, getBaseUrl } from '@/lib/utils'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

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
    const baseUrl = getBaseUrl()
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
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              background-color: #ffffff;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
              color: #000000;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .wrapper {
              padding: 20px;
            }
            .main {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #eeeeee;
            }
            .header {
              padding: 40px;
              border-bottom: 1px solid #000000;
            }
            .identity {
              font-size: 10px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.3em;
              margin-bottom: 40px;
            }
            .identity span { color: #ff3e00; }
            .issue-meta {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #999999;
              margin-bottom: 12px;
            }
            h1 {
              color: #000000;
              font-size: 32px;
              font-weight: 900;
              line-height: 1.1;
              margin: 0 0 24px 0;
              text-transform: uppercase;
              letter-spacing: -0.02em;
            }
            .view-online {
              font-size: 10px;
              color: #ff3e00;
              text-decoration: none;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            .content {
              padding: 40px;
              font-size: 15px;
              line-height: 1.6;
              color: #333333;
            }
            .content p { margin-bottom: 24px; }
            .content h1, .content h2, .content h3 { 
              color: #000000;
              margin-top: 48px; 
              margin-bottom: 16px; 
              line-height: 1.2;
              text-transform: uppercase;
              font-weight: 900;
            }
            .content h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
            .content h3 { font-size: 18px; }
            .content img { 
              max-width: 100%; 
              height: auto; 
              margin: 32px 0;
              display: block;
              border: 1px solid #eeeeee;
            }
            .content blockquote { 
              border-left: 4px solid #ff3e00; 
              margin: 32px 0; 
              padding: 16px 32px; 
              background: #f9f9f9; 
              font-style: italic;
              color: #555555;
            }
            .content code { 
              background: #f1f1f1; 
              padding: 2px 6px; 
              font-family: inherit;
              font-size: 0.9em;
              color: #000000;
              font-weight: 700;
            }
            .content pre {
              background: #000000;
              color: #ffffff;
              padding: 32px;
              overflow-x: auto;
              margin: 32px 0;
              font-size: 13px;
              line-height: 1.5;
            }
            .content ul, .content ol { margin-bottom: 24px; padding-left: 20px; }
            .content li { margin-bottom: 12px; }
            .content hr { border: none; border-top: 1px solid #eeeeee; margin: 48px 0; }
            
            .footer {
              background-color: #f9f9f9;
              padding: 40px;
              border-top: 1px solid #eeeeee;
              text-align: left;
            }
            .footer-brand {
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              margin-bottom: 8px;
            }
            .footer-sub {
              font-size: 10px;
              font-weight: 700;
              color: #999999;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 24px;
            }
            .social-links {
              margin-bottom: 32px;
            }
            .social-link {
              color: #000000;
              text-decoration: none;
              font-weight: 800;
              font-size: 10px;
              margin-right: 20px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            .unsubscribe-info {
              color: #bbbbbb;
              font-size: 10px;
              line-height: 1.8;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 600;
            }
            .unsubscribe-link {
              color: #999999;
              text-decoration: underline;
            }
            
            @media only screen and (max-width: 600px) {
              .main { border: none; }
              .header, .content, .footer { padding: 24px; }
              h1 { font-size: 28px; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="main">
              <!-- Header -->
              <div class="header">
                <div class="identity">GEORGE<span>.</span>ONGORO</div>
                <div class="issue-meta">Dispatch // Issue #${issue.slug.split('-').pop()?.substring(0, 6) || 'Latest'}</div>
                <h1>${subject}</h1>
                <a href="${baseUrl}/newsletter/archive/${slug}" class="view-online">
                  Open in browser &rarr;
                </a>
              </div>
              
              <!-- Main Content -->
              <div class="content">
                ${processedContent}
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-brand">George Ongoro</div>
                <div class="footer-sub">Software Engineer // Independent Maker</div>

                <div class="social-links">
                  <a href="https://github.com/004Ongoro" class="social-link">GitHub</a>
                  <a href="https://x.com/ongorogeorg_e" class="social-link">Twitter</a>
                  <a href="https://linkedin.com/in/georgeongoro2" class="social-link">LinkedIn</a>
                </div>

                <div class="unsubscribe-info">
                  Sent to you because you joined the circle at 
                  <a href="${baseUrl}" style="color: #999999;">george.blog</a>.<br>
                  No longer interested? 
                  <a href="${baseUrl}/unsubscribe" class="unsubscribe-link">Unsubscribe here</a>.
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `

    const trackingParams = {
      utm_source: 'newsletter',
      utm_medium: 'email',
      utm_campaign: slug,
    }

    const trackedEmailHtml = emailHtml.replace(/href=(["'])([^"']+)\1/g, (match, quote, url) => {
      if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
        return match
      }
      return `href=${quote}${addTrackingParams(url, trackingParams)}${quote}`
    })


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
        from: 'George Ongoro <george.blog@deepread.website>',
        to: email,
        subject: subject,
        html: trackedEmailHtml,
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
