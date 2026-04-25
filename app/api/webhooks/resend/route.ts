import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EmailEvent from '@/models/EmailEvent'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('Missing RESEND_WEBHOOK_SECRET')
    return new Response('Error: Missing webhook secret', { status: 500 })
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  // Process the webhook
  const { type, data } = evt

  try {
    await dbConnect()

    await EmailEvent.create({
      type,
      resendId: data.email_id || data.id,
      from: data.from,
      to: Array.isArray(data.to) ? data.to : [data.to].filter(Boolean),
      subject: data.subject,
      data: data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing webhook event:', error)
    return new Response('Error: Internal Server Error', { status: 500 })
  }
}
