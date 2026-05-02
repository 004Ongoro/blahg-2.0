import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { getSession } from '@/lib/auth'

/**
 * GET: Fetch subscribers for admin management with pagination and search
 */
export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    await dbConnect()

    const query = search 
      ? { email: { $regex: search, $options: 'i' } } 
      : {}

    const skip = (page - 1) * limit

    const [subscribers, totalFiltered, totalAll, totalActive] = await Promise.all([
      Subscriber.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscriber.countDocuments(query),
      Subscriber.countDocuments({}),
      Subscriber.countDocuments({ active: true })
    ])
    
    return NextResponse.json({
      subscribers,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        pages: Math.ceil(totalFiltered / limit)
      },
      stats: {
        total: totalAll,
        active: totalActive
      }
    })
  } catch (error) {
    console.error('Fetch Subscribers Error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

/**
 * PATCH: Toggle subscriber active status
 */
export async function PATCH(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, active } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await dbConnect()
    const subscriber = await Subscriber.findByIdAndUpdate(id, { active }, { new: true })
    
    return NextResponse.json(subscriber)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 })
  }
}

/**
 * DELETE: Remove a subscriber
 */
export async function DELETE(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await dbConnect()
    await Subscriber.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 })
  }
}
