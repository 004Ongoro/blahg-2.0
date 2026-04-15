import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 })
    }

    await dbConnect()
    const result = await Subscriber.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    )

    if (!result) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })
  } catch (error: any) {
    console.error('Unsubscribe Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}