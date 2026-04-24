'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Trash2, UserCheck, UserX, Search, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/subscribers')
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data)
      }
    } catch (err) {
      console.error('Failed to load subscribers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentStatus }),
      })
      if (res.ok) {
        setSubscribers(subscribers.map(s => s._id === id ? { ...s, active: !currentStatus } : s))
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
        setSubscribers(subscribers.filter(s => s._id !== id))
      }
    } catch (err) {
      alert('Delete failed')
    }
  }

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link href="/admin/newsletter" className="text-xs font-bold uppercase text-accent hover:underline mb-2 block">
              ← Back to Broadcast Center
            </Link>
            <h1 className="text-4xl font-black uppercase italic">
              Subscriber <span className="text-accent">List</span>
            </h1>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full brutal-border bg-card pl-10 pr-4 py-2 font-bold focus:ring-2 ring-accent outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 brutal-border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSubscribers.length === 0 ? (
              <div className="brutal-border p-8 text-center bg-card text-muted-foreground font-bold italic">
                {search ? `No subscribers matching "${search}"` : 'No subscribers found.'}
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-black uppercase text-muted-foreground">
                  <div className="col-span-5">Subscriber</div>
                  <div className="col-span-3">Joined</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                {filteredSubscribers.map((sub) => (
                  <div 
                    key={sub._id} 
                    className="brutal-border bg-card p-5 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:translate-x-[-2px] transition-transform"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent flex items-center justify-center brutal-border">
                        <Mail size={20} className="text-accent-foreground" />
                      </div>
                      <span className="font-black truncate">{sub.email}</span>
                    </div>
                    
                    <div className="col-span-3 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <Calendar size={14} />
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => toggleStatus(sub._id, sub.active)}
                        className={`px-3 py-1 brutal-border text-[10px] font-black uppercase transition-colors ${
                          sub.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {sub.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    
                    <div className="col-span-2 flex justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(sub._id, sub.active)}
                        title={sub.active ? "Deactivate" : "Activate"}
                        className="p-2 brutal-border bg-secondary hover:bg-accent transition-colors"
                      >
                        {sub.active ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button 
                        onClick={() => deleteSubscriber(sub._id)}
                        className="p-2 brutal-border bg-destructive text-destructive-foreground hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-6 brutal-border bg-accent/10 border-dashed">
          <p className="text-xs font-bold uppercase">
            Total Subscribers: <span className="text-accent text-lg">{subscribers.length}</span> 
            <span className="mx-2">|</span>
            Active: <span className="text-green-600 text-lg">{subscribers.filter(s => s.active).length}</span>
          </p>
        </div>
      </main>
    </div>
  )
}
