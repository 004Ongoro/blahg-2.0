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
        statusText: 'CONNECTING',
        statusTitle: 'Establishing Heartbeat...',
        statusSubtext: 'Querying remote systems status telemetry...',
        colorClass: 'bg-zinc-400 dark:bg-zinc-500',
        pulseClass: 'bg-zinc-400/30 dark:bg-zinc-500/30',
        textColor: 'text-zinc-500 dark:text-zinc-400',
      }
    }

    switch (status) {
      case 'operational':
        return {
          statusText: 'ONLINE',
          statusTitle: 'ALL SYSTEMS OPERATIONAL',
          statusSubtext: 'All nodes communicating normally. Uptime verified.',
          colorClass: 'bg-emerald-500 dark:bg-emerald-400',
          pulseClass: 'bg-emerald-500/30 dark:bg-emerald-400/30',
          textColor: 'text-emerald-600 dark:text-emerald-450',
        }
      case 'degraded_performance':
      case 'under_maintenance':
        return {
          statusText: 'MAINTENANCE',
          statusTitle: 'SYSTEM PERFORMANCE IMPACTED',
          statusSubtext: 'Engineers monitoring server latency and delays.',
          colorClass: 'bg-amber-500 dark:bg-amber-400',
          pulseClass: 'bg-amber-500/30 dark:bg-amber-400/30',
          textColor: 'text-amber-600 dark:text-amber-450',
        }
      case 'partial_outage':
      case 'major_outage':
        return {
          statusText: 'OUTAGE',
          statusTitle: 'CRITICAL SERVICE OUTAGE',
          statusSubtext: 'Server packet failure. Troubleshooting remote cluster.',
          colorClass: 'bg-rose-500 dark:bg-rose-400',
          pulseClass: 'bg-rose-500/30 dark:bg-rose-400/30',
          textColor: 'text-rose-600 dark:text-rose-450',
        }
      default:
        return {
          statusText: 'STANDBY',
          statusTitle: 'HEARTBEAT INACTIVE',
          statusSubtext: 'Failed to establish connection. Telemetry offline.',
          colorClass: 'bg-zinc-500 dark:bg-zinc-400',
          pulseClass: 'bg-zinc-500/30 dark:bg-zinc-400/30',
          textColor: 'text-zinc-500 dark:text-zinc-450',
        }
    }
  }

  const { statusText, statusTitle, statusSubtext, colorClass, pulseClass, textColor } = getStatusDetails()

  return (
    <a
      href="https://code-geohack.openstatus.dev/"
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-foreground/5 bg-card hover:-translate-y-0.5 transition-all text-left rounded-2xl shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {!loading && status === 'operational' && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseClass}`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClass}`}></span>
            </span>
            <span className={`font-black uppercase tracking-wider text-[10px] ${textColor}`}>
              {statusText}
            </span>
          </div>
          
          <h4 className="font-black uppercase tracking-wider text-xs text-foreground">
            {statusTitle}
          </h4>
          <p className="text-[10px] font-bold text-muted-foreground/60 leading-snug">
            {statusSubtext}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between h-full min-h-[50px] shrink-0">
          <div className="p-1.5 border border-foreground/5 bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
            <ExternalLink size={10} />
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              fetchStatus()
            }}
            disabled={loading}
            className="text-[9px] font-black uppercase text-muted-foreground/50 hover:text-foreground flex items-center gap-1 transition-colors mt-2"
            title="Refresh status"
          >
            <RefreshCw size={8} className={loading ? 'animate-spin' : ''} />
            {loading ? 'loading' : 'refresh'}
          </button>
        </div>
      </div>
    </a>
  )
}
