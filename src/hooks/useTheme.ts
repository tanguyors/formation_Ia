'use client'

import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('codex-theme')
    const isDark = stored === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev
      localStorage.setItem('codex-theme', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  return { dark, toggle }
}
