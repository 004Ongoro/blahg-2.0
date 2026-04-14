import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PostEditor } from '@/components/admin/PostEditor'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

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
    title: post ? `Edit: ${post.title} | dev.blog Admin` : 'Edit Post',
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
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="text-accent">{'>'}</span> edit post
        </h1>
        <PostEditor post={post} />
      </main>
    </div>
  )
}
