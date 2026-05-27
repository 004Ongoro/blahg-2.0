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
      <main className="max-w-7xl mx-auto px-4 py-32 w-full">
        {/* Header HUD Section */}
        <header className="mb-12 relative">
          <div className="absolute -top-10 left-0 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Content_Editor</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Edit3 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Modify_Record</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Edit_<span className="text-accent italic">Entry</span>
              </h1>
            </div>
          </div>
        </header>

        <PostEditor post={post} />
      </main>
    </div>
  )
}
