'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed left-1/2 bottom-6 z-50 transition-all duration-300"
      style={{
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(80px)',
        opacity: visible ? 1 : 0,
        background: 'var(--bg-1)',
        border: '1px solid var(--border-strong)',
        borderRadius: 10,
        padding: '10px 20px',
        fontSize: 13,
        color: 'var(--text-1)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {message}
    </div>
  )
}

/* ─── useToast hook ─────────────────────────────────────────────────────────── */
export function useToast() {
  const [state, setState] = useState({ message: '', visible: false })
  const timerRef = { current: null as ReturnType<typeof setTimeout> | null }

  const show = (message: string, ms = 2800) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setState({ message, visible: true })
    timerRef.current = setTimeout(() => setState(s => ({ ...s, visible: false })), ms)
  }

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { toastState: state, showToast: show }
}
