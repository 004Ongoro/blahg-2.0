import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import Post from '@/models/Post'
import Subscriber from '@/models/Subscriber'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PostList } from '@/components/admin/PostList'
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
      
      <main className="max-w-6xl mx-auto px-4 py-32 w-full">
        {/* Header HUD Section */}
        <header className="mb-20 relative">
          <div className="absolute -top-10 left-0 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Admin_Core_Control</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
                  <LayoutDashboard size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Command_Center</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                Dash<span className="text-accent italic">board</span>
              </h1>
            </div>

            <Link
              href="/admin/new"
              className="group h-14 px-8 flex items-center gap-3 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-all shadow-lg active:scale-95"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Initialize_Post
            </Link>
          </div>
        </header>

        {/* Stats HUD Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: 'Total_Records', value: stats.totalPosts, icon: <Database size={16} />, color: 'accent' },
            { label: 'Published_Live', value: stats.publishedPosts, icon: <Activity size={16} />, color: 'green-500', pulse: true },
            { label: 'Subscribers', value: stats.subscribers, icon: <Users size={16} />, color: 'blue-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-background/80 backdrop-blur-sm border border-foreground/5 rounded-[2rem] p-8 relative overflow-hidden group will-change-transform">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                {stat.icon}
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full bg-${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tighter leading-none">{stat.value}</span>
                  <span className="text-[10px] font-bold text-muted-foreground/30 uppercase mb-1">units</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
            </div>
          ))}
        </div>

        {/* Posts List Section */}
        <section className="relative">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Data_Log_Entries</h2>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 w-4 bg-foreground/10 rounded-full" />
              ))}
            </div>
          </div>

          <div className="bg-background/30 backdrop-blur-sm border border-foreground/5 rounded-[2.5rem] p-4 md:p-8">
            <PostList posts={posts} />
          </div>
        </section>

        {/* System Metadata Footer */}
        <div className="mt-20 pt-12 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Auth_Status</span>
              <span className="text-[10px] font-bold">AUTHORIZED_ADMIN</span>
            </div>
            <div className="h-8 w-px bg-foreground/20" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">System_V</span>
              <span className="text-[10px] font-bold">CORE_2.0.4</span>
            </div>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-[0.3em]">
            Connection_Encrypted_TLS_1.3
          </div>
        </div>
      </main>
    </div>
  )
}
