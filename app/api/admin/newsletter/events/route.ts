import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EmailEvent from '@/models/EmailEvent'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const events = await EmailEvent.find({}).sort({ createdAt: -1 }).limit(100).lean()
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Fetch Events Error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
