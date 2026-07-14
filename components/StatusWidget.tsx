'use client'

import * as React from 'react'
import { ExternalLink, RefreshCw } from 'lucide-react'

type StatusType = 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage' | 'under_maintenance' | 'unknown'

interface StatusResponse {
  status: StatusType
}

export function StatusWidget() {
  const [status, setStatus] = React.useState<StatusType>('unknown')
  const [loading, setLoading] = React.useState(true)

  const fetchStatus = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('https://api.openstatus.dev/public/status/code-geohack')
      if (!res.ok) throw new Error('Failed to fetch status')
      const data: StatusResponse = await res.json()
      setStatus(data.status)
    } catch (err) {
      console.error('Error fetching OpenStatus:', err)
      setStatus('unknown')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchStatus()
    // Poll every 5 minutes
    const interval = setInterval(fetchStatus, 300000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  const getStatusDetails = () => {
    if (loading && status === 'unknown') {
      return {
        text: 'Checking status...',
        colorClass: 'bg-zinc-400 dark:bg-zinc-500',
        pulseClass: 'bg-zinc-400/30 dark:bg-zinc-500/30',
        textColor: 'text-zinc-500 dark:text-zinc-400',
      }
    }

    switch (status) {
      case 'operational':
        return {
          text: 'Operational',
          colorClass: 'bg-emerald-500 dark:bg-emerald-400',
          pulseClass: 'bg-emerald-500/30 dark:bg-emerald-400/30',
          textColor: 'text-emerald-600 dark:text-emerald-400',
        }
      case 'degraded_performance':
      case 'under_maintenance':
        return {
          text: status === 'under_maintenance' ? 'Maintenance' : 'Degraded',
          colorClass: 'bg-amber-500 dark:bg-amber-400',
          pulseClass: 'bg-amber-500/30 dark:bg-amber-400/30',
          textColor: 'text-amber-600 dark:text-amber-400',
        }
      case 'partial_outage':
      case 'major_outage':
        return {
          text: 'Outage',
          colorClass: 'bg-rose-500 dark:bg-rose-400',
          pulseClass: 'bg-rose-500/30 dark:bg-rose-400/30',
          textColor: 'text-rose-600 dark:text-rose-400',
        }
      default:
        return {
          text: 'Status Unknown',
          colorClass: 'bg-zinc-500 dark:bg-zinc-400',
          pulseClass: 'bg-zinc-500/30 dark:bg-zinc-400/30',
          textColor: 'text-zinc-500 dark:text-zinc-400',
        }
    }
  }

  const { text, colorClass, pulseClass, textColor } = getStatusDetails()

  return (
    <a
      href="https://code-geohack.openstatus.dev/"
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 brutal-border bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)] dark:hover:shadow-[6px_6px_0_rgba(255,255,255,0.1)] transition-all group relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/10 transition-colors" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {!loading && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseClass}`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 border border-foreground/10 ${colorClass}`}></span>
            </span>
            <span className={`font-black uppercase tracking-wider text-xs ${textColor}`}>
              {text}
            </span>
          </div>
          <h4 className="font-black uppercase tracking-widest text-base flex items-center gap-1.5 text-foreground">
            System Status
          </h4>
          <p className="text-[11px] font-bold text-muted-foreground leading-snug">
            Live uptime monitoring and incident reports.
          </p>
        </div>

        <div className="flex flex-col items-end justify-between h-full min-h-[58px]">
          <div className="p-1 brutal-border bg-background group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              fetchStatus()
            }}
            disabled={loading}
            className="text-[9px] font-black uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors mt-2"
            title="Refresh status"
          >
            <RefreshCw size={9} className={loading ? 'animate-spin' : ''} />
            {loading ? 'updating' : 'refresh'}
          </button>
        </div>
      </div>
    </a>
  )
}
