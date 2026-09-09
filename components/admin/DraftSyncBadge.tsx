'use client'

import React from 'react'
import { SyncStatus } from '@/hooks/useAutoSaveDraft'
import { CheckCircle, Cloud, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DraftSyncBadgeProps {
  status: SyncStatus
  lastSyncedTime: string | null
  onManualSync?: () => void
  className?: string
}

export function DraftSyncBadge({
  status,
  lastSyncedTime,
  onManualSync,
  className,
}: DraftSyncBadgeProps) {
  if (status === 'idle') return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all border',
        status === 'local_saved' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        status === 'syncing' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        status === 'synced' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        status === 'sync_error' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        className
      )}
    >
      {status === 'local_saved' && (
        <>
          <Cloud size={12} className="animate-pulse" />
          <span>Saved locally</span>
        </>
      )}

      {status === 'syncing' && (
        <>
          <Loader2 size={12} className="animate-spin" />
          <span>Syncing DB...</span>
        </>
      )}

      {status === 'synced' && (
        <>
          <CheckCircle size={12} />
          <span>
            Synced to DB {lastSyncedTime ? `(${lastSyncedTime})` : ''}
          </span>
        </>
      )}

      {status === 'sync_error' && (
        <>
          <AlertCircle size={12} />
          <span>Saved locally (DB sync pending)</span>
          {onManualSync && (
            <button
              type="button"
              onClick={onManualSync}
              className="ml-1 hover:underline flex items-center gap-0.5"
              title="Retry sync"
            >
              <RefreshCw size={10} />
            </button>
          )}
        </>
      )}
    </div>
  )
}
