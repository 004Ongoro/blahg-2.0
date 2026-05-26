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
              background-color: #f4f7f9;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #334155;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .main {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .header {
              padding: 48px 40px 24px;
            }
            .issue-tag {
              display: inline-block;
              background-color: #f1f5f9;
              color: #64748b;
              font-size: 12px;
              font-weight: 600;
              padding: 4px 12px;
              border-radius: 9999px;
              margin-bottom: 16px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            h1 {
              color: #0f172a;
              font-size: 32px;
              font-weight: 800;
              line-height: 1.2;
              margin: 0 0 16px 0;
            }
            .view-online {
              font-size: 13px;
              color: #3b82f6;
              text-decoration: none;
              font-weight: 500;
            }
            .content {
              padding: 0 40px 48px;
              font-size: 17px;
              line-height: 1.6;
              color: #334155;
            }
            .content p { margin-bottom: 24px; }
            .content h1, .content h2, .content h3 { 
              color: #1e293b;
              margin-top: 40px; 
              margin-bottom: 16px; 
              line-height: 1.2;
            }
            .content h1 { font-size: 28px; font-weight: 800; }
            .content h2 { font-size: 24px; font-weight: 700; }
            .content h3 { font-size: 20px; font-weight: 600; }
            .content img { 
              max-width: 100%; 
              height: auto; 
              border-radius: 8px;
              margin: 32px 0;
              display: block;
            }
            .content blockquote { 
              border-left: 4px solid #3b82f6; 
              margin: 32px 0; 
              padding: 8px 24px; 
              background: #f8fafc; 
              font-style: italic;
              color: #475569;
            }
            .content code { 
              background: #f1f5f9; 
              padding: 2px 6px; 
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 0.9em;
              border-radius: 4px;
              color: #0f172a;
            }
            .content pre {
              background: #0f172a;
              color: #f8fafc;
              padding: 24px;
              border-radius: 8px;
              overflow-x: auto;
              margin: 32px 0;
              font-size: 14px;
              line-height: 1.5;
            }
            .content ul, .content ol { margin-bottom: 24px; padding-left: 20px; }
            .content li { margin-bottom: 12px; }
            .content hr { border: none; border-top: 1px solid #e2e8f0; margin: 48px 0; }
            
            .cta-section {
              padding: 0 40px 48px;
            }
            .cta-box {
              background-color: #f8fafc;
              border-radius: 12px;
              padding: 32px;
              border: 1px solid #e2e8f0;
            }
            .cta-box h3 {
              margin: 0 0 12px 0;
              color: #0f172a;
              font-size: 18px;
              font-weight: 700;
            }
            .cta-box p {
              margin: 0;
              font-size: 15px;
              color: #64748b;
              line-height: 1.5;
            }
            
            .footer {
              background-color: #f8fafc;
              padding: 48px 40px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
            }
            .footer-name {
              color: #0f172a;
              font-size: 18px;
              font-weight: 700;
              margin: 0 0 4px 0;
            }
            .footer-title {
              color: #64748b;
              font-size: 14px;
              margin: 0 0 24px 0;
            }
            .social-links {
              margin-bottom: 32px;
            }
            .social-link {
              color: #3b82f6;
              text-decoration: none;
              font-weight: 600;
              font-size: 14px;
              margin: 0 12px;
            }
            .unsubscribe-info {
              color: #94a3b8;
              font-size: 12px;
              line-height: 1.6;
              max-width: 400px;
              margin: 0 auto 24px;
            }
            .unsubscribe-link {
              color: #64748b;
              text-decoration: underline;
              font-weight: 500;
            }
            
            @media only screen and (max-width: 600px) {
              .main { margin: 0 auto; border-radius: 0; }
              .header, .content, .cta-section, .footer { padding-left: 24px; padding-right: 24px; }
              h1 { font-size: 28px; }
            }
          </style>
        </head>
        <body>
          <div class="main">
            <!-- Header -->
            <div class="header">
              <div style="margin-bottom: 32px;">
                <img src="${baseUrl}/logo.png" alt="Logo" height="40" style="display: block; height: 40px; width: auto;">
              </div>
              <span class="issue-tag">Issue #${issue.slug.split('-').pop()?.substring(0, 6) || 'Latest'}</span>
              <h1>${subject}</h1>
              <a href="${baseUrl}/newsletter/archive/${slug}" class="view-online">
                View in browser ↗
              </a>
            </div>
            
            <!-- Main Content -->
            <div class="content">
              ${processedContent}
            </div>

            <!-- CTA -->
            <div class="cta-section">
              <div class="cta-box">
                <h3>Let's Chat</h3>
                <p>
                  I love hearing from readers. Hit reply to this email to share your thoughts, questions, or just to say hi. I read and respond to every single one.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-name">George Ongoro</p>
              <p class="footer-title">Software Engineer & Maker</p>

              <div class="social-links">
                <a href="https://github.com/004Ongoro" class="social-link">GitHub</a>
                <a href="https://x.com/ongorogeorg_e" class="social-link">Twitter</a>
                <a href="https://linkedin.com/in/georgeongoro2" class="social-link">LinkedIn</a>
              </div>

              <div class="unsubscribe-info">
                You're receiving this because you subscribed to the newsletter on 
                <a href="${baseUrl}" style="color: #64748b;">code.geohack.top</a>.<br>
                If you no longer wish to receive these emails, you can 
                <a href="${baseUrl}/unsubscribe" class="unsubscribe-link">unsubscribe here</a>.
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
