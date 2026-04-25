'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { History, Mail, Calendar, Info, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function EmailEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/newsletter/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (err) {
      console.error("Failed to load events", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'email.sent': return 'bg-blue-200 text-blue-800'
      case 'email.delivered': return 'bg-green-200 text-green-800'
      case 'email.bounced': return 'bg-red-200 text-red-800'
      case 'email.complained': return 'bg-orange-200 text-orange-800'
      case 'email.opened': return 'bg-purple-200 text-purple-800'
      case 'email.clicked': return 'bg-cyan-200 text-cyan-800'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
             <Link href="/admin/newsletter" className="brutal-border p-2 hover:bg-accent transition-colors">
                <span className="font-bold">←</span>
             </Link>
             <h1 className="text-4xl font-black uppercase italic">
               Email <span className="text-accent">Events</span>
             </h1>
          </div>
          <button 
            onClick={fetchEvents}
            className="flex items-center justify-center gap-2 brutal-border bg-white px-4 py-2 font-black uppercase text-xs hover:bg-accent transition-colors"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="brutal-border bg-card p-6 brutal-shadow mb-8">
            <p className="font-bold text-sm uppercase flex items-center gap-2">
                <Info size={16} className="text-accent" />
                These events are received via webhooks from Resend.
            </p>
        </div>

        <div className="grid gap-4">
          {loading && events.length === 0 ? (
            <div className="brutal-border p-8 text-center bg-card font-bold animate-pulse">
              LOADING EVENTS...
            </div>
          ) : events.length === 0 ? (
            <div className="brutal-border p-8 text-center bg-card text-muted-foreground font-bold italic">
              No email events found. Make sure your Resend webhook is configured.
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event._id} 
                className="brutal-border bg-card p-5 flex flex-col gap-4 hover:translate-x-[-2px] transition-transform"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 brutal-border ${getStatusColor(event.type)}`}>
                        {event.type.replace('email.', '')}
                      </span>
                      <h3 className="font-black uppercase text-lg leading-none">{event.subject || 'No Subject'}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Mail size={12}/> {event.to.join(', ')}</span>
                      <span className="text-accent">|</span>
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(event.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-[10px] font-mono bg-secondary p-1 brutal-border">
                    ID: {event.resendId}
                  </div>
                </div>

                {event.data?.bounce?.reason && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-2 text-xs font-bold text-red-700">
                        BOUNCE REASON: {event.data.bounce.reason}
                    </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
