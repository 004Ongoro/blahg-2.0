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
    // Fetch all non-draft issues, sorted by newest first
    const issues = await NewsletterIssue.find({ isDraft: { $ne: true } }).sort({ createdAt: -1 }).lean()
    
    return NextResponse.json(issues)
  } catch (error) {
    console.error('Fetch Archive Error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

/**
 * POST: Blast a new newsletter or auto-save a draft
 */
export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { subject, content, isMarkdown = true, publishToArchive = true, recipients, isDraft, draftId } = await req.json()
    const baseUrl = getBaseUrl()

    await dbConnect()

    if (isDraft) {
      const draftSubject = subject || 'Untitled Newsletter Draft'
      const draftContent = content || ''
      const draftSlug = `draft-issue-${draftId || Date.now()}`

      let issue
      if (draftId) {
        issue = await NewsletterIssue.findByIdAndUpdate(
          draftId,
          {
            subject: draftSubject,
            content: draftContent,
            isMarkdown,
            published: false,
            isDraft: true,
          },
          { new: true }
        )
      }

      if (!issue) {
        issue = await NewsletterIssue.create({
          subject: draftSubject,
          content: draftContent,
          isMarkdown,
          slug: draftSlug,
          published: false,
          isDraft: true,
        })
      }

      return NextResponse.json({ success: true, isDraft: true, issue }, { status: 200 })
    }

    // Clean up temporary draft from DB if present before dispatching
    if (draftId) {
      try {
        await NewsletterIssue.findByIdAndDelete(draftId)
      } catch (e) {
        console.error('Failed to clean up newsletter draft:', e)
      }
    }

    const slug = `${slugify(subject || 'broadcast')}-${Date.now()}`
    
    // Save to database first so the slug is reserved and "View in Browser" link works
    const issue = await NewsletterIssue.create({
      subject,
      content,
      isMarkdown,
      slug,
      published: publishToArchive,
      isDraft: false
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
              background-color: #f8fafc;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #374151;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .wrapper {
              padding: 24px 12px;
            }
            .main {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              padding: 32px 32px 24px 32px;
              border-bottom: 1px solid #f1f5f9;
            }
            .header-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .identity {
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.05em;
              color: #0f172a;
              text-transform: uppercase;
            }
            .view-online {
              font-size: 13px;
              color: #2563eb;
              text-decoration: none;
              font-weight: 500;
              display: inline-block;
            }
            .view-online:hover {
              text-decoration: underline;
            }
            .issue-meta {
              font-size: 12px;
              font-weight: 600;
              color: #64748b;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            h1.issue-title {
              color: #0f172a;
              font-size: 26px;
              font-weight: 800;
              line-height: 1.25;
              margin: 0;
            }
            .content {
              padding: 32px;
              font-size: 16px;
              line-height: 1.65;
              color: #334155;
            }
            .content p {
              margin-top: 0;
              margin-bottom: 20px;
            }
            .content h1, .content h2, .content h3 {
              color: #0f172a;
              font-weight: 700;
              line-height: 1.3;
              margin-top: 32px;
              margin-bottom: 12px;
            }
            .content h1 { font-size: 22px; }
            .content h2 { font-size: 19px; }
            .content h3 { font-size: 17px; }
            .content img {
              max-width: 100%;
              height: auto;
              margin: 24px 0;
              display: block;
              border-radius: 6px;
            }
            .content blockquote {
              border-left: 3px solid #cbd5e1;
              margin: 20px 0;
              padding: 12px 18px;
              background: #f8fafc;
              font-style: italic;
              color: #475569;
              border-radius: 0 4px 4px 0;
            }
            .content code {
              background: #f1f5f9;
              color: #0f172a;
              padding: 2px 6px;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 0.9em;
              border-radius: 4px;
            }
            .content pre {
              background: #0f172a;
              color: #f8fafc;
              padding: 20px;
              overflow-x: auto;
              margin: 24px 0;
              font-size: 14px;
              line-height: 1.5;
              border-radius: 6px;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            .content ul, .content ol {
              margin-top: 0;
              margin-bottom: 20px;
              padding-left: 24px;
            }
            .content li {
              margin-bottom: 8px;
            }
            .content a {
              color: #2563eb;
              text-decoration: underline;
            }
            .content hr {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 32px 0;
            }
            
            .footer {
              background-color: #f8fafc;
              padding: 32px;
              border-top: 1px solid #e2e8f0;
              text-align: left;
            }
            .footer-brand {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .footer-sub {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 20px;
            }
            .social-links {
              margin-bottom: 24px;
            }
            .social-link {
              color: #2563eb;
              text-decoration: none;
              font-weight: 500;
              font-size: 12px;
              margin-right: 16px;
            }
            .unsubscribe-info {
              color: #64748b;
              font-size: 12px;
              line-height: 1.6;
            }
            .unsubscribe-link {
              color: #475569;
              text-decoration: underline;
            }
            
            @media only screen and (max-width: 600px) {
              .wrapper { padding: 12px 6px; }
              .header, .content, .footer { padding: 20px; }
              h1.issue-title { font-size: 22px; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="main">
              <!-- Header -->
              <div class="header">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                  <tr>
                    <td align="left" style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
                      George Ongoro
                    </td>
                    <td align="right">
                      <a href="${baseUrl}/newsletter/archive/${slug}" class="view-online">
                        View in browser &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <div class="issue-meta">Dispatch // Issue #${issue.slug.split('-').pop()?.substring(0, 6) || 'Latest'}</div>
                <h1 class="issue-title">${subject}</h1>
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
                  Sent to you because you subscribed at <a href="${baseUrl}" style="color: #2563eb; text-decoration: none;">code.geohack.top</a>.<br>
                  No longer interested? <a href="${baseUrl}/unsubscribe" class="unsubscribe-link">Unsubscribe here</a>.
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
      const batchRequest = chunk.map(email => {
        // Personalize unsubscribe link first
        const personalizedUnsubscribe = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`
        const emailWithUnsubscribe = emailHtml.replace(
          new RegExp(`${baseUrl}/unsubscribe`, 'g'),
          personalizedUnsubscribe
        )

        // Add tracking params to all URLs cleanly
        const trackedEmailHtml = emailWithUnsubscribe.replace(/href=(["'])([^"']+)\1/g, (match, quote, url) => {
          if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
            return match
          }
          return `href=${quote}${addTrackingParams(url, trackingParams)}${quote}`
        })

        return {
          from: 'George Ongoro <george@geohack.top>',
          to: email,
          subject: subject,
          html: trackedEmailHtml,
        }
      })

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
