'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { 
  History, 
  Mail, 
  Calendar, 
  Info, 
  RefreshCcw, 
  BarChart3, 
  TrendingUp, 
  Users, 
  XCircle, 
  ArrowLeft,
  Activity,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

  const statsBySubject = useMemo(() => {
    const stats: Record<string, { sent: number; opened: Set<string>; delivered: number; bounced: number }> = {}

    events.forEach(event => {
      const subj = event.subject || 'No Subject'
      if (!stats[subj]) {
        stats[subj] = { sent: 0, opened: new Set(), delivered: 0, bounced: 0 }
      }

      if (event.type === 'email.sent') stats[subj].sent++
      if (event.type === 'email.delivered') stats[subj].delivered++
      if (event.type === 'email.bounced') stats[subj].bounced++
      if (event.type === 'email.opened') {
        event.to.forEach((recipient: string) => stats[subj].opened.add(recipient))
      }
    })

    return Object.entries(stats)
      .filter(([subj]) => subj !== 'No Subject')
      .map(([subject, data]) => {
        const totalSent = data.sent || data.delivered 
        const uniqueOpens = data.opened.size
        const openRate = totalSent > 0 ? (uniqueOpens / totalSent) * 100 : 0
        return {
          subject,
          sent: totalSent,
          opened: uniqueOpens,
          openRate: openRate.toFixed(1),
          bounced: data.bounced
        }
      })
      .sort((a, b) => b.sent - a.sent)
  }, [events])

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'email.sent': return 'bg-blue-100 text-blue-800'
      case 'email.delivered': return 'bg-green-100 text-green-800'
      case 'email.bounced': return 'bg-red-100 text-red-800'
      case 'email.complained': return 'bg-orange-100 text-orange-800'
      case 'email.opened': return 'bg-purple-100 text-purple-800'
      case 'email.clicked': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
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
                  System Events
                </div>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                  Transmission_<span className="text-accent italic">Analytics</span>
                </h1>
              </div>
            </div>

            <button 
              onClick={fetchEvents}
              className="h-14 px-8 flex items-center justify-center gap-3 brutal-btn bg-accent text-accent-foreground font-black uppercase text-lg transition-all"
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} /> 
              Sync Logs
            </button>
          </div>
        </header>

        <div className="brutal-border bg-card p-6 mb-16 flex items-center gap-4">
          <Info size={24} className="text-accent shrink-0" />
          <p className="text-sm font-bold uppercase tracking-widest leading-tight">
            Metrics synchronized via Resend Webhook Protocol.
          </p>
        </div>

        {/* Performance Metrics */}
        {statsBySubject.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <BarChart3 size={24} className="text-accent" />
              <h2 className="text-3xl font-black uppercase italic">Issue Performance</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {statsBySubject.map((stat, idx) => (
                <div key={idx} className="brutal-border brutal-shadow bg-card p-8 group transition-all hover:bg-muted/10">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8 leading-none truncate" title={stat.subject}>
                    {stat.subject}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sent</span>
                      <span className="text-3xl font-black leading-none">{stat.sent}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest">Open Rate</span>
                      <span className="text-3xl font-black leading-none text-accent">{stat.openRate}%</span>
                    </div>
                    <div className="flex flex-col gap-1 text-blue-600">
                      <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Reads</span>
                      <span className="text-3xl font-black leading-none">{stat.opened}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-destructive">
                      <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Bounce</span>
                      <span className="text-3xl font-black leading-none">{stat.bounced}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transmission Log */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <History size={24} className="text-accent" />
            <h2 className="text-3xl font-black uppercase italic">Event Logs</h2>
          </div>

          <div className="space-y-4">
            {loading && events.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-24 brutal-border bg-muted animate-pulse" />
              ))
            ) : events.length === 0 ? (
              <div className="py-20 text-center brutal-border border-dashed bg-muted/30 opacity-60">
                <p className="text-xl font-black uppercase tracking-widest">No transmissions recorded</p>
              </div>
            ) : (
              events.map((event) => (
                <div 
                  key={event._id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 brutal-border bg-card transition-all hover:bg-muted/10"
                >
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-3 py-1 brutal-border text-[10px] font-black uppercase tracking-widest leading-none",
                        getStatusColor(event.type)
                      )}>
                        {event.type.replace('email.', '')}
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tight truncate leading-none">
                        {event.subject || 'Internal Log'}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-muted-foreground uppercase">
                      <span className="flex items-center gap-2">
                        <Mail size={14} />
                        {event.to.join(', ')}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-foreground text-background px-3 py-1 text-[10px] font-mono brutal-border">
                    ID: {event.resendId}
                  </div>

                  {event.data?.bounce?.reason && (
                    <div className="w-full mt-4 p-3 bg-red-100 text-red-800 brutal-border text-xs font-bold uppercase tracking-widest">
                      ERROR_NODE: {event.data.bounce.reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
