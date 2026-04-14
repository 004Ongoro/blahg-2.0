import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'

async function checkSetupRequired() {
  try {
    await dbConnect()
    const admin = await Admin.findOne({})
    return !admin
  } catch {
    return true
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const setupRequired = await checkSetupRequired()
  const session = await getSession()

  // Allow access to setup page without auth
  if (setupRequired) {
    return <>{children}</>
  }

  // Skip redirect for login page
  // The login page is a client component and doesn't need server-side protection
  // It will handle its own logic
  
  // Redirect to login if not authenticated for protected pages
  if (!session) {
    redirect('/admin/login')
  }

  return <>{children}</>
}