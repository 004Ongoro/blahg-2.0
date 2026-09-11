import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')
const NOTIFY_EMAIL = process.env.ADMIN_EMAIL || 'george@geohack.top'

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    // Handle GitHub Issue Comment event (Utterances creates an issue_comment event)
    if (payload.action === 'created' && payload.comment && payload.issue) {
      const commenter = payload.comment.user?.login || 'Anonymous Reader'
      const commenterAvatar = payload.comment.user?.avatar_url || ''
      const commentBody = payload.comment.body || ''
      const issueTitle = payload.issue.title || 'Blog Post'
      const commentUrl = payload.comment.html_url || payload.issue.html_url

      // Dispatch HTML Email Alert via Resend
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Blog Comments <comments@geohack.top>',
          to: [NOTIFY_EMAIL],
          subject: `💬 New Comment on "${issueTitle}" by @${commenter}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #080c14; color: #f8fafc; padding: 24px; }
                .card { background-color: #0f1626; border: 1px solid rgba(241, 245, 249, 0.12); border-radius: 16px; padding: 24px; max-width: 580px; margin: 0 auto; }
                .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid rgba(241, 245, 249, 0.1); padding-bottom: 16px; }
                .avatar { width: 40px; height: 40px; border-radius: 50%; }
                .user { font-weight: 700; color: #f97316; }
                .title { font-size: 18px; font-weight: 800; margin-bottom: 12px; color: #ffffff; }
                .body { background: #162032; border-radius: 12px; padding: 16px; font-size: 15px; line-height: 1.6; margin-bottom: 20px; white-space: pre-wrap; }
                .btn { display: inline-block; background-color: #f97316; color: #080c14; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 8px; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  ${commenterAvatar ? `<img src="${commenterAvatar}" class="avatar" alt="${commenter}" />` : ''}
                  <div>
                    <div class="user">@${commenter}</div>
                    <div style="font-size: 12px; color: #94a3b8;">Posted a new comment via Utterances</div>
                  </div>
                </div>
                <div class="title">Article: ${issueTitle}</div>
                <div class="body">${commentBody}</div>
                <div>
                  <a href="${commentUrl}" class="btn" target="_blank">View Comment on GitHub &rarr;</a>
                </div>
              </div>
            </body>
            </html>
          `,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error handling GitHub comment webhook:', error)
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 })
  }
}
