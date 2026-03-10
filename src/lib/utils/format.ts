import type { TemperatureUnit } from '@/types/weather'
import { WIND_DIRS, UV_LEVELS } from '@/constants/weather'

/* ─── Temperature ──────────────────────────────────────────────────────────── */
export function toF(c: number): number { return c * 9 / 5 + 32 }

export function displayTemp(c: number, unit: TemperatureUnit): string {
  return unit === 'F' ? `${Math.round(toF(c))}°F` : `${Math.round(c)}°`
}

/* ─── Wind ─────────────────────────────────────────────────────────────────── */
export function windDirection(deg: number): string {
  return WIND_DIRS[Math.round(deg / 22.5) % 16]
}

/* ─── UV ───────────────────────────────────────────────────────────────────── */
export function uvInfo(uv: number): { label: string; color: string } {
  return UV_LEVELS.find(l => uv <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1]
}

/* ─── Time ─────────────────────────────────────────────────────────────────── */
export function formatTime(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDayLabel(iso: string, index: number): string {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return new Date(`${iso}T12:00:00`).toLocaleDateString([], { weekday: 'short' })
}

export function formatHourLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric' })
}

export function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Progress (0-1) through the daylight period, clamped 0-1 */
export function dayProgress(sunriseIso: string, sunsetIso: string): number {
  const now  = Date.now()
  const rise = new Date(sunriseIso).getTime()
  const set  = new Date(sunsetIso).getTime()
  return Math.max(0, Math.min(1, (now - rise) / (set - rise)))
}

/* ─── Visibility ───────────────────────────────────────────────────────────── */
export function formatVisibility(meters: number): string {
  if (meters >= 10000) return `${(meters / 1000).toFixed(0)} km`
  if (meters >= 1000)  return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

export function visibilityLabel(meters: number): string {
  if (meters >= 10000) return 'Excellent'
  if (meters >= 5000)  return 'Good'
  if (meters >= 2000)  return 'Moderate'
  if (meters >= 500)   return 'Poor'
  return 'Very Poor'
}

/* ─── Pressure ─────────────────────────────────────────────────────────────── */
export function pressureTrend(hPa: number): { label: string; direction: '↑' | '↓' | '→' } {
  if (hPa > 1020) return { label: 'High — Fair weather', direction: '↑' }
  if (hPa > 1013) return { label: 'Above avg — Settled', direction: '↑' }
  if (hPa > 1000) return { label: 'Normal — Steady', direction: '→' }
  if (hPa > 990)  return { label: 'Low — Change likely', direction: '↓' }
  return { label: 'Very Low — Unsettled', direction: '↓' }
}

/* ─── Math utils ───────────────────────────────────────────────────────────── */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin)
}

/* ─── Class utility (tiny clsx alternative) ────────────────────────────────── */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
