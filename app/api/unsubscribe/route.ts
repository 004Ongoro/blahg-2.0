import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function POST(req: Request) {
  try {
    const { email, id } = await req.json()

    if (!email && !id) {
      return NextResponse.json({ error: 'Email address or Subscriber ID is required' }, { status: 400 })
    }

    await dbConnect()
    
    let subscriber = null

    if (email) {
      subscriber = await Subscriber.findOne({ email: email.toLowerCase().trim() })
    } else if (id) {
      try {
        subscriber = await Subscriber.findById(id)
      } catch {
        // invalid object id
      }
    }

    if (!subscriber) {
      return NextResponse.json({ error: 'Email address not found in our subscriber list.' }, { status: 404 })
    }

    subscriber.active = false
    await subscriber.save()

    return NextResponse.json({ success: true, message: 'Successfully unsubscribed' })
  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}