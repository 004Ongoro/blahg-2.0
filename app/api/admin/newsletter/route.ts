import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { getSession } from '@/lib/auth'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Converts Markdown content to HTML for email delivery
 */
async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  return result.toString()
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, content, isMarkdown = true } = await req.json()

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    await dbConnect()
    const subscribers = await Subscriber.find({ active: true })
    const recipientEmails = subscribers.map((sub) => sub.email)

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 404 })
    }

    // Process content: Markdown to HTML, or wrap plain text to respect line breaks
    const processedContent = isMarkdown 
      ? await markdownToHtml(content)
      : `<div style="white-space: pre-wrap; font-family: sans-serif;">${content}</div>`

    const { data, error } = await resend.emails.send({
      from: 'George Ongoro <george@ongoro.top>',
      to: 'george@ongoro.top',
      bcc: recipientEmails,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="background-color: #ffffff; font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; border: 4px solid #000000; background-color: #ffffff; box-shadow: 8px 8px 0px #000000;">
              
              <div style="background-color: #fb923c; border-bottom: 4px solid #000000; padding: 30px; text-align: left;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; color: #000000; line-height: 1;">
                  ${subject}
                </h1>
              </div>

              <div style="padding: 30px; font-size: 18px; line-height: 1.6; color: #000000;">
                <div class="email-body">
                  ${processedContent}
                </div>
              </div>

              <div style="padding: 30px; background-color: #f3f4f6; border-top: 4px solid #000000; font-size: 14px; font-weight: bold;">
                <p style="margin: 0 0 10px 0;">Sent from <a href="https://ongoro.top" style="color: #fb923c; text-decoration: none; border-bottom: 2px solid #fb923c;">ongoro.top</a></p>
                <p style="margin: 0;">
                  Need to leave? <a href="https://dev.ongoro.top/newsletter" style="color: #000000;">Unsubscribe here</a>.
                </p>
              </div>
            </div>
            
            <style>
              .email-body h1, .email-body h2 { color: #000; text-transform: uppercase; border-bottom: 2px solid #fb923c; padding-bottom: 5px; }
              .email-body p { margin-bottom: 20px; }
              .email-body a { color: #fb923c; font-weight: bold; }
              .email-body code { background: #eee; padding: 2px 4px; border: 1px solid #000; }
            </style>
          </body>
        </html>
      `,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Newsletter Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}