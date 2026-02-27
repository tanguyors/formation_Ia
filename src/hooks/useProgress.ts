'use client'

import { useState, useEffect, useCallback } from 'react'

interface UserProgress {
  user: {
    id: string
    email: string
    displayName: string | null
    avatarUrl: string | null
    role: string
    level: string
    xp: number
  }
  stats: {
    totalSessions: number
    completedSessions: number
    progressPercent: number
    totalXp: number
  }
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedAt: string
  }>
  progress: Array<{
    sessionId: string
    sessionNumber: number
    sessionTitle: string
    week: number
    status: string
    xpEarned: number
    completedAt: string | null
  }>
}

const POLL_INTERVAL = 30_000 // 30 seconds

export function useProgress() {
  const [data, setData] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const res = await fetch('/api/progress')
      if (!res.ok) throw new Error('Erreur de chargement')
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProgress()

    // Poll every 30s for admin changes
    const interval = setInterval(() => fetchProgress(true), POLL_INTERVAL)

    // Refresh when tab becomes visible again
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        fetchProgress(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchProgress])

  const completeSession = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/progress/${sessionId}/complete`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Erreur de complétion')
      await fetchProgress() // Refresh data immediately
      return true
    } catch {
      return false
    }
  }, [fetchProgress])

  return { data, loading, error, completeSession, refresh: fetchProgress }
}
