'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, X } from 'lucide-react'

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, visible, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm"
        >
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 shadow-lg"
            style={{
              background: 'var(--cx-surface)',
              borderColor: 'var(--cx-accent-border)',
              boxShadow: '0 4px 24px var(--cx-glow)',
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--cx-accent-bg)' }}
            >
              <Zap size={16} style={{ color: 'var(--cx-accent)' }} />
            </div>
            <p className="text-sm font-bold font-mono" style={{ color: 'var(--cx-text)' }}>
              {message}
            </p>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:opacity-70 transition-opacity shrink-0"
              style={{ color: 'var(--cx-text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
