'use server'

import { Resend } from 'resend'
import { getBaseUrl } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

export async function sendContactEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { name, email, subject, message } = formData
  const baseUrl = getBaseUrl()

  if (!name || !email || !subject || !message) {
    return { error: 'All fields are required' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'George Ongoro Contact <contact@geohack.top>', 
      to: 'george@geohack.top',
      subject: `Contact Form: ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
        </head>
        <body style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #374151; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; padding: 32px;">
            <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
                New Contact Form Submission
              </h1>
            </div>
            
            <div style="margin-bottom: 20px;">
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Sender</div>
              <div style="font-size: 16px; font-weight: 600; color: #0f172a;">${name} &lt;<a href="mailto:${email}" style="color: #2563eb; text-decoration: underline;">${email}</a>&gt;</div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Subject</div>
              <div style="font-size: 16px; font-weight: 600; color: #0f172a;">${subject}</div>
            </div>

            <div style="margin-top: 24px; padding: 20px; background-color: #f8fafc; border-left: 3px solid #2563eb; border-radius: 0 6px 6px 0;">
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Message</div>
              <div style="font-size: 16px; line-height: 1.65; color: #1e293b; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: left;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Received via geohack.top contact form
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Contact email error:', err)
    return { error: 'Failed to send email. Please try again later.' }
  }
}
