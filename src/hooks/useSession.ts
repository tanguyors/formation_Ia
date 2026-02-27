'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface SessionData {
  id: string
  week: number
  day: number
  sessionNumber: number
  title: string
  description: string | null
  briefing: string
  objectives: string[]
  date: string
  durationMinutes: number
  videoUrl: string | null
  isPublished: boolean
  userStatus: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'
  xpEarned: number
  completedAt: string | null
}

const POLL_INTERVAL = 30_000

export function useSessions() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null)
  const prevStatusMap = useRef<Map<string, string>>(new Map())

  const fetchSessions = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const res = await fetch('/api/sessions')
      if (!res.ok) throw new Error('Erreur de chargement')
      const data = await res.json()
      const newSessions: SessionData[] = data.sessions

      // Detect newly unlocked sessions (LOCKED → AVAILABLE)
      if (prevStatusMap.current.size > 0) {
        for (const s of newSessions) {
          const prev = prevStatusMap.current.get(s.id)
          if (prev === 'LOCKED' && (s.userStatus === 'AVAILABLE' || s.userStatus === 'IN_PROGRESS')) {
            setNewlyUnlocked(s.title)
            break
          }
        }
      }

      // Update status map
      const map = new Map<string, string>()
      for (const s of newSessions) map.set(s.id, s.userStatus)
      prevStatusMap.current = map

      setSessions(newSessions)
      setError(null)
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  const dismissUnlocked = useCallback(() => setNewlyUnlocked(null), [])

  useEffect(() => {
    fetchSessions()

    const interval = setInterval(() => fetchSessions(true), POLL_INTERVAL)

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        fetchSessions(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchSessions])

  return { sessions, loading, error, refresh: fetchSessions, newlyUnlocked, dismissUnlocked }
}

export function useSession(id: string) {
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${id}`)
      if (!res.ok) throw new Error('Session non trouvée')
      const data = await res.json()
      setSession(data.session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return { session, loading, error, refresh: fetchSession }
}
