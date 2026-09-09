'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type SyncStatus = 'idle' | 'saving_local' | 'local_saved' | 'syncing' | 'synced' | 'sync_error'

interface UseAutoSaveDraftOptions<T> {
  key: string
  data: T
  onRestore: (restoredData: T) => void
  onSyncToDb: (
    data: T,
    currentDraftId: string | null,
    currentDraftSlug: string | null
  ) => Promise<{ draftId?: string; draftSlug?: string } | void>
  enabled?: boolean
  intervalMs?: number
  hasContent: (data: T) => boolean
}

export function useAutoSaveDraft<T>({
  key,
  data,
  onRestore,
  onSyncToDb,
  enabled = true,
  intervalMs = 3000,
  hasContent,
}: UseAutoSaveDraftOptions<T>) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [draftSlug, setDraftSlug] = useState<string | null>(null)

  const isInitialMount = useRef(true)
  const hasPendingChanges = useRef(false)
  const draftIdRef = useRef<string | null>(null)
  const draftSlugRef = useRef<string | null>(null)
  const dataRef = useRef(data)

  dataRef.current = data
  draftIdRef.current = draftId
  draftSlugRef.current = draftSlug

  // 1. Initial Load / Restoration on Mount
  useEffect(() => {
    if (!enabled) return

    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          if (parsed._draftId) {
            setDraftId(parsed._draftId)
            draftIdRef.current = parsed._draftId
          }
          if (parsed._draftSlug) {
            setDraftSlug(parsed._draftSlug)
            draftSlugRef.current = parsed._draftSlug
          }
          onRestore(parsed as T)
          setSyncStatus('local_saved')
        }
      }
    } catch (err) {
      console.error(`Failed to restore draft for key ${key}:`, err)
    }

    const timer = setTimeout(() => {
      isInitialMount.current = false
    }, 150)
    return () => clearTimeout(timer)
  }, [key, enabled])

  // 3. Periodic & Flush Auto-Sync to Database
  const triggerSync = useCallback(async () => {
    if (!hasPendingChanges.current || !hasContent(dataRef.current)) return

    setSyncStatus('syncing')
    try {
      const res = await onSyncToDb(
        dataRef.current,
        draftIdRef.current,
        draftSlugRef.current
      )
      if (res?.draftId) {
        setDraftId(res.draftId)
        draftIdRef.current = res.draftId
      }
      if (res?.draftSlug) {
        setDraftSlug(res.draftSlug)
        draftSlugRef.current = res.draftSlug
      }

      try {
        const raw = localStorage.getItem(key)
        const parsed = raw ? JSON.parse(raw) : {}
        localStorage.setItem(
          key,
          JSON.stringify({
            ...parsed,
            _draftId: draftIdRef.current,
            _draftSlug: draftSlugRef.current,
          })
        )
      } catch (e) {}

      hasPendingChanges.current = false
      setSyncStatus('synced')
      setLastSyncedTime(new Date().toLocaleTimeString())
    } catch (err) {
      console.error(`Auto-sync to DB failed for key ${key}:`, err)
      setSyncStatus('sync_error')
    }
  }, [key, onSyncToDb, hasContent])

  // 2. Save to Local Storage on every change & trigger debounced DB sync
  useEffect(() => {
    if (isInitialMount.current || !enabled) return
    if (!hasContent(data)) return

    try {
      const payload = {
        ...data,
        _draftId: draftIdRef.current,
        _draftSlug: draftSlugRef.current,
        _updatedAt: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(payload))
      hasPendingChanges.current = true
      setSyncStatus('local_saved')
    } catch (err) {
      console.error(`Failed to save local draft for key ${key}:`, err)
    }

    // Debounced sync after typing stops (1.5s)
    const debounceTimer = setTimeout(() => {
      if (hasPendingChanges.current) {
        triggerSync()
      }
    }, 1500)

    return () => clearTimeout(debounceTimer)
  }, [data, key, enabled, hasContent, triggerSync])

  // Periodic fallback interval & unload listener
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      if (hasPendingChanges.current) {
        triggerSync()
      }
    }, intervalMs)

    const handleVisibilityOrUnload = () => {
      if (hasPendingChanges.current) {
        triggerSync()
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityOrUnload)
    window.addEventListener('pagehide', handleVisibilityOrUnload)
    window.addEventListener('beforeunload', handleVisibilityOrUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('visibilitychange', handleVisibilityOrUnload)
      window.removeEventListener('pagehide', handleVisibilityOrUnload)
      window.removeEventListener('beforeunload', handleVisibilityOrUnload)
    }
  }, [intervalMs, triggerSync, enabled])

  // 4. Clear Draft (on Publish/Submit)
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error(`Failed to remove draft key ${key}:`, err)
    }
    const currentId = draftIdRef.current
    const currentSlug = draftSlugRef.current
    setDraftId(null)
    setDraftSlug(null)
    draftIdRef.current = null
    draftSlugRef.current = null
    hasPendingChanges.current = false
    setSyncStatus('idle')
    return { draftId: currentId, draftSlug: currentSlug }
  }, [key])

  return {
    syncStatus,
    lastSyncedTime,
    draftId,
    draftSlug,
    clearDraft,
    triggerSync,
  }
}
