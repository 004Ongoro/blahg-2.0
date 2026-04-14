import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import Post from '@/models/Post'
import Subscriber from '@/models/Subscriber'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PostList } from '@/components/admin/PostList'

async function checkSetupRequired() {
  try {
    await dbConnect()
    const admin = await Admin.findOne({})
    return !admin
  } catch {
    return true
  }
}

async function getStats() {
  try {
    await dbConnect()
    const [totalPosts, publishedPosts, subscribers] = await Promise.all([
      Post.countDocuments({}),
      Post.countDocuments({ published: true }),
      Subscriber.countDocuments({ active: true }),
    ])
    return { totalPosts, publishedPosts, subscribers }
  } catch {
    return { totalPosts: 0, publishedPosts: 0, subscribers: 0 }
  }
}

async function getPosts() {
  try {
    await dbConnect()
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .select('-content')
      .lean()
    return JSON.parse(JSON.stringify(posts))
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Admin | dev.blog',
}

export default async function AdminPage() {
  const setupRequired = await checkSetupRequired()
  
  if (setupRequired) {
    redirect('/admin/setup')
  }

  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  const [stats, posts] = await Promise.all([getStats(), getPosts()])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-accent">{'>'}</span> dashboard
          </h1>
          <Link
            href="/admin/new"
            className="brutal-btn bg-accent text-accent-foreground px-4 py-2 font-bold"
          >
            + new post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="brutal-border brutal-shadow bg-card p-6">
            <p className="text-muted-foreground text-sm">total posts</p>
            <p className="text-3xl font-bold">{stats.totalPosts}</p>
          </div>
          <div className="brutal-border brutal-shadow bg-card p-6">
            <p className="text-muted-foreground text-sm">published</p>
            <p className="text-3xl font-bold text-accent">{stats.publishedPosts}</p>
          </div>
          <div className="brutal-border brutal-shadow bg-card p-6">
            <p className="text-muted-foreground text-sm">subscribers</p>
            <p className="text-3xl font-bold">{stats.subscribers}</p>
          </div>
        </div>

        {/* Posts List */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            <span className="text-accent">{'>'}</span> all posts
          </h2>
          <PostList posts={posts} />
        </section>
      </main>
    </div>
  )
}
