'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWeather }       from '@/hooks/useWeather'
import { WeatherScene }     from '@/components/weather/WeatherScene'
import { Dashboard }        from '@/components/layout/Dashboard'
import { Header }           from '@/components/layout/Header'
import { SearchModal }      from '@/components/location/SearchModal'
import { Onboarding }       from '@/components/layout/Onboarding'
import { LoadingScreen }    from '@/components/ui/LoadingScreen'
import { Toast, useToast }  from '@/components/ui/Toast'
import type { Location, DisasterType } from '@/types/weather'

const ONBOARD_KEY = 'aether-onboarded'

export default function Page() {
  const {
    state, loadLocation, requestGeolocation,
    useMock, refresh, setTheme, toggleDisasterMode, setDisasterType,
  } = useWeather()

  const [searchOpen,    setSearchOpen]    = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loadStatus,    setLoadStatus]    = useState('Calibrating atmospheric sensors…')
  const { toastState, showToast }         = useToast()

  /* Apply theme to DOM on mount and changes */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  /* Show onboarding on first visit */
  useEffect(() => {
    const done = typeof window !== 'undefined' && localStorage.getItem(ONBOARD_KEY)
    if (!done) {
      setShowOnboarding(true)
    } else {
      // Returning user — try to load last location or request geo
      const recent = state.recentLocations
      if (recent.length > 0) {
        loadLocation(recent[0])
      } else {
        requestGeolocation()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Loading status messages ── */
  useEffect(() => {
    if (!state.loading) return
    const msgs = [
      'Calibrating atmospheric sensors…',
      'Fetching satellite data…',
      'Parsing weather models…',
      'Rendering atmospheric conditions…',
    ]
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % msgs.length
      setLoadStatus(msgs[i])
    }, 1800)
    return () => clearInterval(id)
  }, [state.loading])

  /* ── Keyboard shortcut ⌘K / Ctrl+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* ── Offline detection ── */
  useEffect(() => {
    const onOffline = () => showToast('You are offline. Showing cached data.')
    const onOnline  = () => { showToast('Back online! Refreshing…'); refresh() }
    window.addEventListener('offline', onOffline)
    window.addEventListener('online',  onOnline)
    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online',  onOnline)
    }
  }, [refresh, showToast])

  /* ── Handlers ── */
  const handleOnboardGeo = useCallback(() => {
    localStorage.setItem(ONBOARD_KEY, '1')
    setShowOnboarding(false)
    requestGeolocation()
  }, [requestGeolocation])

  const handleOnboardSkip = useCallback(() => {
    localStorage.setItem(ONBOARD_KEY, '1')
    setShowOnboarding(false)
    setSearchOpen(true)
  }, [])

  const handleLocationSelect = useCallback((loc: Location) => {
    loadLocation(loc)
    showToast(`Loading weather for ${loc.city}…`)
  }, [loadLocation, showToast])

  const handleThemeToggle = useCallback(() => {
    const next = state.theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }, [state.theme, setTheme])

  const handleDisasterType = useCallback((t: DisasterType) => {
    setDisasterType(t)
    showToast(`Simulation: ${t.charAt(0).toUpperCase() + t.slice(1)} scenario loaded`)
  }, [setDisasterType, showToast])

  const handleRetry = useCallback(() => {
    if (state.location) {
      showToast('Retrying weather fetch…')
      loadLocation(state.location)
    }
  }, [state.location, loadLocation, showToast])

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen visible={state.loading && !showOnboarding} status={loadStatus} />

      {/* Onboarding modal */}
      {showOnboarding && (
        <Onboarding onGeo={handleOnboardGeo} onSkip={handleOnboardSkip} />
      )}

      {/* Main app */}
      <div style={{ opacity: state.loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <Header
          location={state.location}
          theme={state.theme}
          onSearch={() => setSearchOpen(true)}
          onTheme={handleThemeToggle}
          onRefresh={refresh}
        />

        <main>
          <WeatherScene
            weather={state.weather}
            unit={state.unit}
            disasterMode={state.disasterMode}
            disasterType={state.disasterType}
            loading={state.loading}
          />
          <Dashboard
            state={state}
            onSearch={() => setSearchOpen(true)}
            onToggleDisaster={toggleDisasterMode}
            onDisasterType={handleDisasterType}
            onRetry={handleRetry}
          />
        </main>
      </div>

      {/* Search modal */}
      <SearchModal
        open={searchOpen}
        recent={state.recentLocations}
        onClose={() => setSearchOpen(false)}
        onSelect={handleLocationSelect}
      />

      {/* Toast */}
      <Toast message={toastState.message} visible={toastState.visible} />
    </>
  )
}
