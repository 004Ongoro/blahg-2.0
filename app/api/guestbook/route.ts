import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import GuestbookEntry from '@/models/GuestbookEntry'

export async function GET() {
  try {
    await dbConnect()
    const entries = await GuestbookEntry.find({}).sort({ createdAt: -1 }).limit(100).lean()
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Guestbook fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { name, message } = await request.json()

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 characters)' }, { status: 400 })
    }

    const entry = await GuestbookEntry.create({ name, message })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Guestbook post error:', error)
    return NextResponse.json({ error: 'Failed to post entry' }, { status: 500 })
  }
}
