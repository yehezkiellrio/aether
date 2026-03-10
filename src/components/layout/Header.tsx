'use client'

import { useState } from 'react'
import type { Location, AppState } from '@/types/weather'
import { IconBtn } from '@/components/ui/GlassCard'

interface HeaderProps {
  location:  Location | null
  theme:     AppState['theme']
  onSearch:  () => void
  onTheme:   () => void
  onRefresh: () => void
}

export function Header({ location, theme, onSearch, onTheme, onRefresh }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center gap-4 px-4 py-3 md:px-6"
      style={{
        zIndex: 100,
        background: theme === 'dark' ? 'rgba(6,11,20,0.72)' : 'rgba(235,240,250,0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <span
        className="font-syne text-[17px] font-extrabold tracking-[0.06em] flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #4DA8FF, #9B7AFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        AETHER
      </span>

      {/* Location button */}
      <button
        onClick={onSearch}
        className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-[10px] min-w-0
                   border border-transparent transition-all duration-200
                   hover:border-[var(--border)] hover:bg-[var(--surface-1)]"
        aria-label="Change location"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             style={{ flexShrink: 0 }}>
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium truncate" style={{ color: 'var(--text-1)' }}>
            {location?.city ?? 'Select location'}
          </span>
          {(location?.region || location?.country) && (
            <span className="text-[11px] truncate" style={{ color: 'var(--text-3)' }}>
              {[location.region, location.country].filter(Boolean).join(', ')}
            </span>
          )}
        </div>
        {/* Search indicator */}
        <span className="ml-auto text-[10px] font-mono hidden sm:block"
              style={{ color: 'var(--text-3)', flexShrink: 0 }}>
          ⌘K
        </span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <IconBtn label="Toggle theme" onClick={onTheme}>
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </IconBtn>

        <IconBtn label="Refresh weather" onClick={onRefresh}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </IconBtn>
      </div>
    </header>
  )
}
