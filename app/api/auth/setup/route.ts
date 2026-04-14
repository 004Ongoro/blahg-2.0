import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'

// Create initial admin account (only works if no admin exists)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({})
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin account already exists' },
        { status: 400 }
      )
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await Admin.create({ username, password })

    return NextResponse.json(
      { message: 'Admin account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}

// Check if setup is needed
export async function GET() {
  try {
    await dbConnect()
    
    const existingAdmin = await Admin.findOne({})
    
    return NextResponse.json({ setupRequired: !existingAdmin })
  } catch (error) {
    console.error('Error checking setup:', error)
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    )
  }
}
