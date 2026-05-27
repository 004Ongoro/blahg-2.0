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
  Terminal,
  ShieldAlert,
  Clock,
  ExternalLink
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
        const totalSent = data.sent || data.delivered // fallback to delivered if sent is not tracked
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
      case 'email.sent': return { label: 'SENT', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
      case 'email.delivered': return { label: 'DELIVERED', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' }
      case 'email.bounced': return { label: 'BOUNCED', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' }
      case 'email.complained': return { label: 'COMPLAINED', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
      case 'email.opened': return { label: 'OPENED', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' }
      case 'email.clicked': return { label: 'CLICKED', color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' }
      default: return { label: 'UNKNOWN', color: 'text-muted-foreground', bg: 'bg-foreground/5', border: 'border-foreground/10' }
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
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Event_Logs</span>
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
                  <Activity size={24} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Transmission_<span className="text-accent italic">Analytics</span>
                </h1>
              </div>
            </div>

            <button 
              onClick={fetchEvents}
              className="h-12 px-8 flex items-center justify-center gap-3 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-all shadow-xl active:scale-95"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> 
              Synchronize_Data
            </button>
          </div>
        </header>

        <div className="bg-background/80 backdrop-blur-sm border border-foreground/5 rounded-[2.5rem] p-8 shadow-2xl mb-20 relative overflow-hidden group will-change-transform">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Info size={120} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <ShieldAlert size={20} className="text-accent" />
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">System_Status</span>
              <p className="text-xs font-bold uppercase tracking-widest">
                Real-time metrics received via webhooks from the Resend protocol.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        {statsBySubject.length > 0 && (
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12 px-4">
              <BarChart3 size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Performance_Metrics</h2>
              <div className="h-px flex-1 bg-foreground/5" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {statsBySubject.map((stat, idx) => (
                <div key={idx} className="bg-background/80 backdrop-blur-sm border border-foreground/5 rounded-[2rem] p-8 relative overflow-hidden group will-change-transform">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                    <Zap size={60} className="text-accent" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <h3 className="text-xs font-black uppercase tracking-widest truncate max-w-xs" title={stat.subject}>
                        {stat.subject}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest flex items-center gap-1">
                          <Mail size={8} /> Sent
                        </span>
                        <span className="text-2xl font-black tracking-tighter">{stat.sent}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-accent tracking-widest flex items-center gap-1">
                          <TrendingUp size={8} /> Open_Rate
                        </span>
                        <span className="text-2xl font-black tracking-tighter text-accent">{stat.openRate}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest flex items-center gap-1">
                          <Users size={8} /> Reads
                        </span>
                        <span className="text-2xl font-black tracking-tighter">{stat.opened}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-destructive tracking-widest flex items-center gap-1">
                          <XCircle size={8} /> Failures
                        </span>
                        <span className="text-2xl font-black tracking-tighter">{stat.bounced}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transmission Log */}
        <section className="relative">
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-3">
              <Terminal size={16} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Transmission_Log</h2>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1 w-6 bg-foreground/10 rounded-full" />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {loading && events.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-foreground/5 rounded-2xl animate-pulse" />
              ))
            ) : events.length === 0 ? (
              <div className="py-20 text-center bg-background/20 rounded-[2.5rem] border border-dashed border-foreground/10 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Auditorium is empty</p>
              </div>
            ) : (
              events.map((event) => {
                const status = getStatusInfo(event.type)
                return (
                  <div 
                    key={event._id} 
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-background/80 backdrop-blur-sm border border-foreground/5 rounded-2xl hover:border-accent/30 transition-all duration-300 relative overflow-hidden will-change-transform"
                  >
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 transition-all",
                      status.color.replace('text-', 'bg-')
                    )} />

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                          status.bg, status.color, status.border
                        )}>
                          {status.label}
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight truncate group-hover:text-accent transition-colors">
                          {event.subject || 'INTERNAL_TRANSMISSION'}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase">
                          <Mail size={12} className="opacity-30" />
                          <span className="truncate max-w-[200px]">{event.to.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase">
                          <Clock size={12} className="opacity-30" />
                          <span>{new Date(event.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Resend_ID</span>
                        <span className="text-[10px] font-bold uppercase opacity-30 select-all">
                          {event.resendId}
                        </span>
                      </div>
                    </div>

                    {event.data?.bounce?.reason && (
                      <div className="absolute bottom-0 right-0 left-1 p-2 bg-destructive/10 text-destructive text-[8px] font-bold uppercase tracking-widest">
                        ERROR: {event.data.bounce.reason}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* System Metadata Footer */}
        <div className="mt-20 pt-12 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Analytics_V</span>
              <span className="text-[10px] font-bold">MONITOR_2.4.0</span>
            </div>
            <div className="h-8 w-px bg-foreground/20" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
              <span className="text-[10px] font-bold">RESEND_WEBHOOK_TLS</span>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1 w-8 bg-foreground/10 rounded-full" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
