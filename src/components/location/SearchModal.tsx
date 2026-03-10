'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Location, SearchResult } from '@/types/weather'
import { searchLocations } from '@/lib/api/weather'

interface SearchModalProps {
  open:    boolean
  recent:  Location[]
  onClose: () => void
  onSelect:(loc: Location) => void
}

export function SearchModal({ open, recent, onClose, onSelect }: SearchModalProps) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'empty' | 'error'>('idle')
  const inputRef  = useRef<HTMLInputElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Auto-focus input on open */
  useEffect(() => {
    if (open) {
      setQuery(''); setResults([]); setStatus('idle')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  /* Debounced search */
  const handleInput = useCallback(async (q: string) => {
    setQuery(q)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!q || q.length < 2) { setResults([]); setStatus('idle'); return }
    setStatus('loading')
    timerRef.current = setTimeout(async () => {
      try {
        const res = await searchLocations(q)
        setResults(res)
        setStatus(res.length === 0 ? 'empty' : 'idle')
      } catch {
        setStatus('error')
      }
    }, 340)
  }, [])

  const handleSelect = useCallback((lat: number, lon: number, name: string, country: string, region: string) => {
    onSelect({ lat, lon, city: name, country, region })
    onClose()
  }, [onSelect, onClose])

  const showRecent  = !query && recent.length > 0
  const showResults = query.length >= 2 && results.length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 transition-opacity duration-200"
        style={{
          zIndex: 200,
          background: 'rgba(4,8,16,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Modal box */}
      <div
        role="dialog"
        aria-label="Search location"
        className="fixed left-4 right-4 mx-auto transition-all duration-300"
        style={{
          top: 72, zIndex: 201,
          maxWidth: 560,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
          pointerEvents: open ? 'all' : 'none',
          borderRadius: 16,
          background: 'var(--bg-1)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5"
             style={{ borderBottom: '1px solid var(--border)' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
               stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            placeholder="Search city, region, or country…"
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: 15, color: 'var(--text-1)', fontFamily: 'var(--font-outfit)' }}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1 transition-colors"
            style={{ color: 'var(--text-3)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 340, overflowY: 'auto' }}>
          {/* Status messages */}
          {status === 'loading' && (
            <div className="py-8 text-center font-mono text-[13px]" style={{ color: 'var(--text-3)' }}>
              Searching…
            </div>
          )}
          {status === 'empty' && (
            <div className="py-8 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
              No locations found. Try a different name.
            </div>
          )}
          {status === 'error' && (
            <div className="py-8 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
              Search unavailable. Check your connection.
            </div>
          )}

          {/* Recent locations */}
          {showRecent && (
            <>
              <div className="px-4 pt-3 pb-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                   style={{ color: 'var(--text-3)' }}>
                Recent
              </div>
              {recent.map((r, i) => (
                <ResultRow
                  key={`recent-${i}`}
                  icon="🕐"
                  name={r.city}
                  sub={[r.region, r.country].filter(Boolean).join(', ')}
                  onClick={() => handleSelect(r.lat, r.lon, r.city, r.country, r.region)}
                />
              ))}
            </>
          )}

          {/* Search results */}
          {showResults && results.map(r => (
            <ResultRow
              key={r.id}
              icon="📍"
              name={r.name}
              sub={[r.region, r.country].filter(Boolean).join(', ')}
              onClick={() => handleSelect(r.lat, r.lon, r.name, r.country, r.region)}
            />
          ))}

          {/* Default empty state */}
          {!showRecent && !showResults && status === 'idle' && query.length < 2 && (
            <div className="py-8 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
              Type to search for any city worldwide
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function ResultRow({ icon, name, sub, onClick }: { icon: string; name: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
      style={{ borderBottom: '1px solid var(--border)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-1)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
           style={{ background: 'var(--surface-2)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium truncate" style={{ color: 'var(--text-1)' }}>{name}</div>
        {sub && <div className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{sub}</div>}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)"
           strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  )
}
