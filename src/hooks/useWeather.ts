'use client'

import { useState, useCallback, useRef } from 'react'
import type { AppState, Location, DisasterType } from '@/types/weather'
import { fetchWeather, reverseGeocode, getMockWeather, getMockLocation } from '@/lib/api/weather'
import { APP_CONFIG } from '@/constants/weather'

const STORAGE_KEYS = {
  THEME:   'aether-theme',
  UNIT:    'aether-unit',
  RECENT:  'aether-recent',
} as const

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback }
  catch { return fallback }
}

/* ─── Initial State ─────────────────────────────────────────────────────────── */
function getInitialState(): AppState {
  return {
    weather:           null,
    location:          null,
    loading:           true,
    error:             null,
    permissionDenied:  false,
    isOffline:         typeof navigator !== 'undefined' ? !navigator.onLine : false,
    disasterMode:      false,
    disasterType:      null,
    theme:             loadStorage(STORAGE_KEYS.THEME, 'dark'),
    unit:              loadStorage(STORAGE_KEYS.UNIT, 'C'),
    recentLocations:   loadStorage(STORAGE_KEYS.RECENT, []),
    useMockData:       false,
    lastUpdated:       null,
  }
}

/* ─── Hook ──────────────────────────────────────────────────────────────────── */
export function useWeather() {
  const [state, setState] = useState<AppState>(getInitialState)
  const abortRef = useRef<AbortController | null>(null)

  const update = useCallback((patch: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  /* Load weather for lat/lon */
  const loadWeather = useCallback(async (lat: number, lon: number) => {
    // Cancel any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    update({ loading: true, error: null })
    try {
      const data = await fetchWeather(lat, lon)
      update({ weather: data, error: null, useMockData: false, loading: false, lastUpdated: new Date() })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.warn('[Aether] Weather fetch failed, using mock data:', error.message)
      update({ weather: getMockWeather(), error, useMockData: true, loading: false, lastUpdated: new Date() })
    }
  }, [update])

  /* Load location + weather */
  const loadLocation = useCallback(async (loc: Location) => {
    update({ location: loc, loading: true })
    // Persist recent
    setState(prev => {
      const filtered = prev.recentLocations.filter(
        r => !(Math.abs(r.lat - loc.lat) < 0.01 && Math.abs(r.lon - loc.lon) < 0.01)
      )
      const recent = [loc, ...filtered].slice(0, APP_CONFIG.MAX_RECENT_LOCS)
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent))
      return { ...prev, recentLocations: recent }
    })
    await loadWeather(loc.lat, loc.lon)
  }, [update, loadWeather])

  /* Load with mock data (demo mode) */
  const useMock = useCallback(() => {
    const loc = getMockLocation()
    update({ location: loc, weather: getMockWeather(), useMockData: true, loading: false, lastUpdated: new Date() })
  }, [update])

  /* Request geolocation from browser */
  const requestGeolocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      update({ permissionDenied: true, loading: false })
      useMock()
      return
    }
    update({ loading: true })
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        const geo = await reverseGeocode(lat, lon)
        const loc: Location = { lat, lon, ...geo }
        await loadLocation(loc)
      },
      err => {
        console.warn('[Aether] Geolocation denied:', err.code)
        update({ permissionDenied: true })
        useMock()
      },
      { timeout: 8000, maximumAge: 300000 }
    )
  }, [loadLocation, update, useMock])

  /* Refresh current location */
  const refresh = useCallback(() => {
    if (state.location) loadWeather(state.location.lat, state.location.lon)
  }, [state.location, loadWeather])

  /* Theme */
  const setTheme = useCallback((theme: AppState['theme']) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    update({ theme })
    document.documentElement.setAttribute('data-theme', theme)
  }, [update])

  /* Unit */
  const setUnit = useCallback((unit: AppState['unit']) => {
    localStorage.setItem(STORAGE_KEYS.UNIT, unit)
    update({ unit })
  }, [update])

  /* Disaster mode */
  const toggleDisasterMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      disasterMode:  !prev.disasterMode,
      disasterType:  !prev.disasterMode ? (prev.disasterType ?? 'thunderstorm') : null,
    }))
  }, [])

  const setDisasterType = useCallback((type: DisasterType) => {
    update({ disasterMode: true, disasterType: type })
  }, [update])

  return {
    state,
    loadLocation,
    loadWeather,
    requestGeolocation,
    useMock,
    refresh,
    setTheme,
    setUnit,
    toggleDisasterMode,
    setDisasterType,
  }
}
