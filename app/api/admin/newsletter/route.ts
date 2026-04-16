import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { getSession } from '@/lib/auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, content } = await req.json()

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const subscribers = await Subscriber.find({ active: true })
    const recipientEmails = subscribers.map((sub) => sub.email)

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 404 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'George Ongoro <george@ongoro.top>',
      to: 'george@ongoro.top',
      bcc: recipientEmails,
      subject: subject,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; border: 3px solid #000; padding: 20px; background-color: #fff;">
          <h1 style="text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 10px;">${subject}</h1>
          <div style="font-size: 16px; line-height: 1.5; margin: 20px 0;">
            ${content}
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 3px solid #000; font-size: 12px;">
            <p>Sent from <strong>ongoro.top</strong></p>
            <p>You may reply to this address directly, I read all replies.</p>
            <p>
              To manage your subscription or opt-out, visit my 
              <a href="https://dev.ongoro.top/newsletter" style="color: #ff0000;">Newsletter Center</a>.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Newsletter Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}