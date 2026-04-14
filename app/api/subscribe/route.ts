import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await Subscriber.findOne({ email: email.toLowerCase() })
    
    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { error: 'Already subscribed!' },
          { status: 400 }
        )
      }
      // Reactivate subscription
      existing.active = true
      await existing.save()
      return NextResponse.json({ message: 'Welcome back!' })
    }

    await Subscriber.create({ email })

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
