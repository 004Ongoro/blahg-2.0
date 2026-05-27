import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import Post from '@/models/Post'
import Subscriber from '@/models/Subscriber'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PostList } from '@/components/admin/PostList'
import { cn } from '@/lib/utils'
import { PlusCircle, Database, LayoutDashboard, Activity, Users, FileText } from 'lucide-react'

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
  title: 'Admin Dashboard | George Ongoro',
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
    <div className="min-h-screen bg-background font-mono">
      <AdminHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="bg-accent text-accent-foreground px-3 py-1 text-[10px] font-black uppercase mb-4 inline-block brutal-border">
                Command Center
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                Dash<span className="text-accent italic">board</span>
              </h1>
            </div>

            <Link
              href="/admin/new"
              className="group brutal-btn h-16 px-10 flex items-center gap-3 bg-accent text-accent-foreground font-black uppercase text-xl transition-all"
            >
              <PlusCircle size={24} />
              New Post
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total Records', value: stats.totalPosts, icon: <Database size={20} />, color: 'bg-card' },
            { label: 'Live Posts', value: stats.publishedPosts, icon: <Activity size={20} />, color: 'bg-green-100' },
            { label: 'Subscribers', value: stats.subscribers, icon: <Users size={20} />, color: 'bg-blue-100' }
          ].map((stat, i) => (
            <div key={i} className={cn("brutal-border brutal-shadow p-8 flex flex-col gap-6", stat.color)}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <div className="bg-foreground text-background p-2 brutal-border">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-black tracking-tighter leading-none">{stat.value}</span>
                <span className="text-xs font-bold uppercase mb-1">Units</span>
              </div>
            </div>
          ))}
        </div>

        {/* Posts List Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <FileText size={24} className="text-accent" />
            <h2 className="text-3xl font-black uppercase tracking-tight italic">Content Records</h2>
          </div>

          <div className="brutal-border brutal-shadow bg-card p-4 md:p-8">
            <PostList posts={posts} />
          </div>
        </section>

        {/* Footer Metadata */}
        <div className="mt-20 pt-12 border-t-4 border-foreground flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-6 text-xs font-black uppercase">
            <span>Authorized Admin</span>
            <span className="h-1 w-1 bg-foreground rounded-full" />
            <span>Core v2.1.0</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Secure Connection Active
          </div>
        </div>
      </main>
    </div>
  )
}
