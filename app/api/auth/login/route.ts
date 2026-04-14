import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await admin.comparePassword(password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = await createToken(admin._id.toString())
    await setAuthCookie(token)

    return NextResponse.json({ message: 'Login successful' })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
