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
  Activity, 
  Filter,
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
    if (!confirm('Permanently remove this subscriber?')) return
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
      
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Link 
                href="/admin/newsletter"
                className="group inline-flex items-center gap-2 px-3 py-1 brutal-border bg-card font-black uppercase text-[10px] hover:bg-accent transition-all"
              >
                <ArrowLeft size={12} /> Back
              </Link>
              <div>
                <div className="bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-black uppercase mb-4 inline-block brutal-border">
                  Audience Database
                </div>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                  Subscri<span className="text-accent italic">bers</span>
                </h1>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full brutal-border bg-background pl-12 pr-4 h-14 font-bold text-lg focus:ring-4 ring-accent outline-none border-black"
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total Audience', value: stats.total, icon: <Users size={20} />, color: 'bg-card' },
            { label: 'Active Nodes', value: stats.active, icon: <Activity size={20} />, color: 'bg-green-100' },
            { label: 'Filtered', value: pagination.total, icon: <Filter size={20} />, color: 'bg-blue-100' }
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
                <span className="text-xs font-bold uppercase mb-1">Nodes</span>
              </div>
            </div>
          ))}
        </div>

        {/* List Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase italic">Verified Registry</h2>
            <div className="flex-1 h-1 bg-foreground opacity-10" />
          </div>

          <div className="space-y-4">
            {loading && subscribers.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-24 brutal-border bg-muted animate-pulse" />
              ))
            ) : subscribers.length === 0 ? (
              <div className="py-20 text-center brutal-border border-dashed bg-muted/30 opacity-60">
                <p className="text-xl font-black uppercase tracking-widest">No records found</p>
              </div>
            ) : (
              subscribers.map((sub) => (
                <div 
                  key={sub._id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 brutal-border bg-card transition-all hover:bg-muted/10"
                >
                  <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex items-center gap-4 min-w-0 max-w-md">
                      <div className="h-12 w-12 shrink-0 bg-accent brutal-border flex items-center justify-center text-accent-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Mail size={24} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black uppercase tracking-tight truncate leading-none mb-2">
                          {sub.email}
                        </h3>
                        <div className={cn(
                          "inline-block px-2 py-0.5 brutal-border text-[8px] font-black uppercase tracking-widest",
                          sub.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                          {sub.active ? 'Active Node' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="opacity-40">Joined</span>
                        <span className="text-foreground">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="opacity-40">Node ID</span>
                        <span className="text-foreground opacity-30">{sub._id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleStatus(sub._id, sub.active)}
                      className={cn(
                        "h-12 px-6 brutal-border font-black uppercase text-xs transition-all",
                        sub.active ? "bg-white hover:bg-destructive hover:text-white" : "bg-accent hover:bg-accent/80"
                      )}
                    >
                      {sub.active ? 'Deactivate' : 'Restore'}
                    </button>
                    <button 
                      onClick={() => deleteSubscriber(sub._id)}
                      className="h-12 w-12 flex items-center justify-center brutal-border bg-destructive text-destructive-foreground hover:bg-red-700 transition-all"
                      title="Purge Record"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchSubscribers(pagination.page - 1, search)}
                  disabled={pagination.page === 1}
                  className="h-12 px-6 brutal-border bg-card font-black uppercase text-xs hover:bg-accent disabled:opacity-30 transition-all"
                >
                  Prev
                </button>
                
                <div className="flex gap-2">
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
                            "w-12 h-12 brutal-border font-black text-sm transition-all",
                            isActive ? "bg-accent" : "bg-card hover:bg-accent/50"
                          )}
                        >
                          {p}
                        </button>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => fetchSubscribers(pagination.page + 1, search)}
                  disabled={pagination.page === pagination.pages}
                  className="h-12 px-6 brutal-border bg-card font-black uppercase text-xs hover:bg-accent disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-left: 2px solid black;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border: 2px solid black;
        }
      `}</style>
    </div>
  )
}
