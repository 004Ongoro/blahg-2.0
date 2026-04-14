import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PostEditor } from '@/components/admin/PostEditor'

export const metadata = {
  title: 'New Post | dev.blog Admin',
}

export default async function NewPostPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="text-accent">{'>'}</span> new post
        </h1>
        <PostEditor />
      </main>
    </div>
  )
}
