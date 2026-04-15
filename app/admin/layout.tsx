import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'

async function checkSetupRequired(): Promise<boolean> {
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
  
  return <>{children}</>
}