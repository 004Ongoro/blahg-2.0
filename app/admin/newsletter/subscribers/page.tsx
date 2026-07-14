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
      
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 w-full">
        {/* Header Section */}
        <header className="mb-12 border-b-2 border-foreground pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Link 
                href="/admin/newsletter"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={12} /> Back to dispatch
              </Link>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Audience_<span className="text-accent italic">Nodes</span>
              </h1>
            </div>

            <div className="relative w-full md:w-80 group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-foreground/10 rounded-full pl-10 pr-4 h-11 text-sm font-medium focus:outline-none focus:ring-1 ring-accent transition-all"
              />
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Total Audience', value: stats.total, icon: <Users size={12} /> },
            { label: 'Active Nodes', value: stats.active, icon: <Activity size={12} />, accent: true },
            { label: 'Query Match', value: pagination.total, icon: <Filter size={12} /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                {stat.icon} {stat.label}
              </div>
              <div className={cn("text-4xl font-black tracking-tighter leading-none", stat.accent && "text-accent")}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* List Section */}
        <section className="space-y-4">
          <div className="divide-y divide-foreground/5 border-t border-foreground/5">
            {loading && subscribers.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse bg-foreground/[0.01]" />
              ))
            ) : subscribers.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sector is empty</p>
              </div>
            ) : (
              subscribers.map((sub) => (
                <div 
                  key={sub._id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 transition-all"
                >
                  <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="min-w-0 max-w-md">
                      <h3 className="text-base font-black uppercase tracking-tight truncate mb-1">
                        {sub.email}
                      </h3>
                      <div className={cn(
                        "inline-block px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border",
                        sub.active 
                          ? "bg-accent/5 text-accent border-accent/10" 
                          : "bg-foreground/5 text-muted-foreground border-foreground/10"
                      )}>
                        {sub.active ? 'ACTIVE_SESSION' : 'INACTIVE_NODE'}
                      </div>
                    </div>
                    
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <div className="flex flex-col">
                        <span>Joined</span>
                        <span className="text-foreground/60">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span>Object ID</span>
                        <span className="opacity-40">{sub._id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleStatus(sub._id, sub.active)}
                      className={cn(
                        "h-9 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                        sub.active 
                          ? "bg-foreground/5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
                          : "bg-accent text-accent-foreground hover:opacity-90"
                      )}
                    >
                      {sub.active ? 'DEACTIVATE' : 'RESTORE'}
                    </button>
                    <button 
                      onClick={() => deleteSubscriber(sub._id)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                      title="Purge Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center border-t border-foreground/5 pt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchSubscribers(pagination.page - 1, search)}
                  disabled={pagination.page === 1}
                  className="h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-foreground/5 transition-all"
                >
                  Prev
                </button>
                
                <div className="flex gap-1 px-4 border-x border-foreground/5">
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
                            isActive ? "bg-foreground text-background" : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5"
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
                  className="h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-foreground/5 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
