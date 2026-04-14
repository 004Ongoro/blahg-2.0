import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { headers } from 'next/headers'

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
  
  // Get the current path from headers to identify the login page
  const headersList = await headers()
  const fullUrl = headersList.get('x-url') || ''
  const isLoginPage = fullUrl.endsWith('/admin/login')

  // Allow access to setup page without auth
  if (setupRequired) {
    return <>{children}</>
  }

  // Redirect to login if not authenticated for protected pages,
  if (!session && !isLoginPage) {
    redirect('/admin/login')
  }

  return <>{children}</>
}