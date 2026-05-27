'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { 
  Trash2, 
  UserCheck, 
  UserX, 
  Search, 
  Mail, 
  Calendar, 
  ArrowLeft, 
  Users, 
  ShieldCheck, 
  Activity, 
  Filter,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  })
  const [stats, setStats] = useState({
    total: 0,
    active: 0
  })

  const fetchSubscribers = async (page = 1, searchQuery = '') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/subscribers?page=${page}&search=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data.subscribers)
        setPagination(data.pagination)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to load subscribers', err)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscribers(1, search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentStatus }),
      })
      if (res.ok) {
        setSubscribers(subscribers.map(s => s._id === id ? { ...s, active: !currentStatus } : s))
        setStats(prev => ({
          ...prev,
          active: prev.active + (currentStatus ? -1 : 1)
        }))
      }
    } catch (err) {
      alert('Update failed')
    }
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Permanently remove this subscriber from the database?')) return
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSubscribers(pagination.page, search)
      }
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono pb-20">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-32 w-full">
        {/* Header HUD Section */}
        <header className="mb-20 relative">
          <div className="absolute -top-10 left-0 flex items-center gap-3 opacity-30">
            <div className="h-[1px] w-8 bg-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Audience_Management</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Link 
                href="/admin/newsletter"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-md border border-foreground/5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
              >
                <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
                Return_to_Broadcast
              </Link>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent">
                  <Users size={24} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Audience_<span className="text-accent italic">Database</span>
                </h1>
              </div>
            </div>

            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-accent transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search emails or handles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-full pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-lg"
              />
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total_Subscribers', value: stats.total, icon: <Users size={16} />, color: 'accent' },
            { label: 'Active_Nodes', value: stats.active, icon: <Activity size={16} />, color: 'green-500', pulse: true },
            { label: 'Search_Results', value: pagination.total, icon: <Filter size={16} />, color: 'blue-500', subValue: search ? `Filtering: "${search}"` : 'Global_View' }
          ].map((stat, i) => (
            <div key={i} className="bg-background/40 backdrop-blur-xl border border-foreground/5 rounded-[2rem] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                {stat.icon}
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={cn("h-1.5 w-1.5 rounded-full", `bg-${stat.color}`, stat.pulse && "animate-pulse")} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black tracking-tighter leading-none">{stat.value}</span>
                  <span className="text-[8px] font-bold text-muted-foreground/30 uppercase mb-1">units</span>
                </div>
                {stat.subValue && (
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate">{stat.subValue}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* List Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified_Registry</span>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 w-4 bg-foreground/5 rounded-full" />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {loading && subscribers.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-foreground/5 rounded-2xl animate-pulse" />
              ))
            ) : subscribers.length === 0 ? (
              <div className="py-20 text-center bg-background/20 rounded-[2.5rem] border border-dashed border-foreground/10 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No records found in current sector</p>
              </div>
            ) : (
              subscribers.map((sub) => (
                <div 
                  key={sub._id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 bg-background/40 backdrop-blur-md border border-foreground/5 rounded-2xl hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 transition-all",
                    sub.active ? "bg-accent" : "bg-muted-foreground/20"
                  )} />

                  <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4 min-w-0 max-w-md">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-foreground/5 flex items-center justify-center text-muted-foreground/40 group-hover:text-accent transition-colors">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black uppercase tracking-tight truncate">
                          {sub.email}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={cn(
                            "px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border",
                            sub.active 
                              ? "bg-accent/10 text-accent border-accent/20" 
                              : "bg-foreground/5 text-muted-foreground border-foreground/10"
                          )}>
                            {sub.active ? 'ACTIVE_SESSION' : 'INACTIVE_NODE'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1">
                          <Calendar size={8} /> Onboarding_Date
                        </span>
                        <span className="text-[10px] font-bold uppercase">
                          {new Date(sub.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Object_ID</span>
                        <span className="text-[10px] font-bold uppercase opacity-30">
                          {sub._id.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleStatus(sub._id, sub.active)}
                      className={cn(
                        "h-10 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        sub.active 
                          ? "bg-foreground/5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
                          : "bg-accent text-accent-foreground shadow-lg active:scale-95"
                      )}
                    >
                      {sub.active ? (
                        <><UserX size={14} /> Deactivate_Link</>
                      ) : (
                        <><UserCheck size={14} /> Restore_Link</>
                      )}
                    </button>
                    <button 
                      onClick={() => deleteSubscriber(sub._id)}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                      title="Purge Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination HUD */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-1 p-1 bg-background/50 backdrop-blur-md border border-foreground/5 rounded-full shadow-lg">
                <button
                  onClick={() => fetchSubscribers(pagination.page - 1, search)}
                  disabled={pagination.page === 1}
                  className="h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-foreground/5 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={12} /> PREV
                </button>
                
                <div className="flex gap-1 px-2 border-x border-foreground/5">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => {
                    const isActive = pagination.page === p
                    if (
                      p === 1 || 
                      p === pagination.pages || 
                      (p >= pagination.page - 1 && p <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={p}
                          onClick={() => fetchSubscribers(p, search)}
                          className={cn(
                            "w-9 h-9 rounded-full text-[10px] font-black transition-all",
                            isActive ? "bg-foreground text-background shadow-md" : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5"
                          )}
                        >
                          {p.toString().padStart(2, '0')}
                        </button>
                      )
                    } else if (
                      p === pagination.page - 2 || 
                      p === pagination.page + 2
                    ) {
                      return <span key={p} className="w-4 flex items-center justify-center text-[10px] opacity-20">.</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => fetchSubscribers(pagination.page + 1, search)}
                  disabled={pagination.page === pagination.pages}
                  className="h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-foreground/5 transition-all flex items-center gap-2"
                >
                  NEXT <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* System Metadata Footer */}
        <div className="mt-20 pt-12 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Registry_V</span>
              <span className="text-[10px] font-bold">STABLE_3.4.1</span>
            </div>
            <div className="h-8 w-px bg-foreground/20" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Auth_Token</span>
              <span className="text-[10px] font-bold">SESSION_JWT_HS256</span>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-1 w-4 bg-foreground/10 rounded-full" />
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
