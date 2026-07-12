import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PostEditor } from '@/components/admin/PostEditor'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { Edit3, Terminal } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    await dbConnect()
    const post = await Post.findOne({ slug }).lean()
    return post ? JSON.parse(JSON.stringify(post)) : null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  
  return {
    title: post ? `Edit: ${post.title} | Admin` : 'Edit Post',
  }
}

export default async function EditPostPage({ params }: Props) {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <AdminHeader />
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-12 border-b-2 border-foreground pb-8">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded mb-2 inline-block">Record_Modifier</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Edit <span className="text-accent italic">Post</span>
              </h1>
            </div>
          </div>
        </header>

        <PostEditor post={post} />
      </main>
    </div>
  )
}
