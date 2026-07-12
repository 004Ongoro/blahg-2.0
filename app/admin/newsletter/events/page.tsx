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

  const getStatusInfo = (type: string) => {
    switch (type) {
      case 'email.sent': return { label: 'SENT', color: 'text-blue-500', bg: 'bg-blue-500/5' }
      case 'email.delivered': return { label: 'DELIVERED', color: 'text-green-600', bg: 'bg-green-600/5' }
      case 'email.bounced': return { label: 'BOUNCED', color: 'text-destructive', bg: 'bg-destructive/5' }
      case 'email.complained': return { label: 'COMPLAINED', color: 'text-orange-500', bg: 'bg-orange-500/5' }
      case 'email.opened': return { label: 'OPENED', color: 'text-accent', bg: 'bg-accent/5' }
      case 'email.clicked': return { label: 'CLICKED', color: 'text-cyan-600', bg: 'bg-cyan-600/5' }
      default: return { label: 'UNKNOWN', color: 'text-muted-foreground', bg: 'bg-foreground/5' }
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
                Transmission_<span className="text-accent italic">Analytics</span>
              </h1>
            </div>

            <button 
              onClick={fetchEvents}
              className="h-11 px-6 flex items-center justify-center gap-2 bg-foreground text-background rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all active:scale-95"
            >
              <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> 
              Sync_Logs
            </button>
          </div>
        </header>

        {/* Performance Metrics */}
        {statsBySubject.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <BarChart3 size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Issue_Performance</h2>
              <div className="h-px flex-1 bg-foreground/5" />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {statsBySubject.map((stat, idx) => (
                <div key={idx} className="space-y-6 group">
                  <h3 className="text-sm font-black uppercase tracking-tight truncate border-b border-foreground/5 pb-2" title={stat.subject}>
                    {stat.subject}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest">Sent</span>
                      <span className="text-2xl font-black tabular-nums">{stat.sent}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-accent tracking-widest">Reads</span>
                      <span className="text-2xl font-black tabular-nums text-accent">{stat.openRate}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Total</span>
                      <span className="text-2xl font-black tabular-nums">{stat.opened}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-destructive tracking-widest">Fail</span>
                      <span className="text-2xl font-black tabular-nums">{stat.bounced}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transmission Log */}
        <section className="relative">
          <div className="flex items-center justify-between mb-8 border-b border-foreground/5 pb-2">
            <div className="flex items-center gap-2">
              <History size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Activity</h2>
            </div>
          </div>

          <div className="divide-y divide-foreground/5 border-t border-foreground/5">
            {loading && events.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse bg-foreground/[0.01]" />
              ))
            ) : events.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No activity logged</p>
              </div>
            ) : (
              events.map((event) => {
                const info = getStatusInfo(event.type)
                return (
                  <div 
                    key={event._id} 
                    className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border",
                          info.bg, info.color, "border-current opacity-70"
                        )}>
                          {info.label}
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight truncate leading-none">
                          {event.subject || 'Internal transmission'}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] font-bold text-muted-foreground/60 uppercase">
                        <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <Mail size={12} className="opacity-40" />
                          {event.to.join(', ')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="opacity-40" />
                          {new Date(event.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20 select-all">
                      ID: {event.resendId}
                    </div>

                    {event.data?.bounce?.reason && (
                      <div className="w-full mt-2 text-[8px] font-black uppercase tracking-widest text-destructive/60 bg-destructive/5 p-2 rounded">
                        ERROR: {event.data.bounce.reason}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
