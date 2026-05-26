'use server'

import { Resend } from 'resend'
import { getBaseUrl } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY)

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
      from: 'George Ongoro <george.blog@deepread.website>', 
      to: 'george.blog@deepread.website',
      subject: `Contact Form: ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; background-color: #f4f7f9;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 32px;">
              <img src="${baseUrl}/logo.png" alt="Logo" height="32" style="display: block; height: 32px; width: auto;">
            </div>
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">New Contact Message</h2>
            
            <div style="margin-bottom: 24px;">
              <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">From</p>
              <p style="margin: 4px 0 0 0; color: #0f172a; font-size: 16px;"><strong>${name}</strong> (${email})</p>
            </div>

            <div style="margin-bottom: 24px;">
              <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject</p>
              <p style="margin: 4px 0 0 0; color: #0f172a; font-size: 16px;">${subject}</p>
            </div>

            <div style="margin-top: 32px; padding: 24px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
              <pre style="white-space: pre-wrap; margin: 0; font-family: inherit; color: #334155; font-size: 16px; line-height: 1.6;">${message}</pre>
            </div>

            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">This email was sent from the contact form on your blog.</p>
            </div>
          </div>
        </div>
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
