import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await dbConnect()
    
    const result = await Subscriber.findOneAndDelete({ email: email.toLowerCase() })

    if (!result) {
      return NextResponse.json({ error: 'Email not found in our list.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Successfully unsubscribed' })
  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}