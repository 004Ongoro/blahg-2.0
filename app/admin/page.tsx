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
      
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-foreground">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded mb-4 inline-block">Control_Core</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Admin <span className="text-accent italic">Dash</span>
              </h1>
            </div>

            <Link
              href="/admin/new"
              className="group h-12 px-6 flex items-center gap-2 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all"
            >
              <PlusCircle size={16} />
              New Entry
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { label: 'Total Records', value: stats.totalPosts, icon: <Database size={14} /> },
            { label: 'Live Public', value: stats.publishedPosts, icon: <Activity size={14} />, accent: true },
            { label: 'Active Nodes', value: stats.subscribers, icon: <Users size={14} /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {stat.icon} {stat.label}
              </div>
              <div className={cn("text-5xl font-black tracking-tighter tabular-nums leading-none", stat.accent && "text-accent")}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Posts List Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-foreground/5 pb-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Transmissions</h2>
            </div>
          </div>

          <PostList posts={posts} />
        </section>

        {/* Footer Metadata */}
        <div className="mt-32 pt-8 border-t border-foreground/5 flex items-center justify-between opacity-30">
          <div className="text-[8px] font-black uppercase tracking-widest space-x-4">
            <span>Auth: Authorized</span>
            <span>Session: active</span>
          </div>
          <div className="text-[8px] font-black uppercase tracking-widest">
            Core v2.1.4
          </div>
        </div>
      </main>
    </div>
  )
}
