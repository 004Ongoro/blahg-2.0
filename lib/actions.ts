'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { name, email, subject, message } = formData

  if (!name || !email || !subject || !message) {
    return { error: 'All fields are required' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact Form Blog <george@ongoro.top>', 
      to: ['gtechong72@gmail.com'],
      subject: `Contact Form: ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 3px solid #0a0a0a; box-shadow: 4px 4px 0 #0a0a0a;">
          <h2 style="border-bottom: 2px solid #0a0a0a; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5dc; border: 2px solid #0a0a0a;">
            <strong>Message:</strong><br/>
            <pre style="white-space: pre-wrap;">${message}</pre>
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
