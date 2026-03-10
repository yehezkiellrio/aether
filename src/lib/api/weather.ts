import type { WeatherApiResponse, SearchResult, Location } from '@/types/weather'
import { APP_CONFIG } from '@/constants/weather'
import { MOCK_WEATHER, MOCK_LOCATION } from '@/lib/mock/mockData'

/* ─── Weather Data ─────────────────────────────────────────────────────────── */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude:  String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'is_day',
      'precipitation', 'weather_code', 'cloud_cover', 'pressure_msl', 'surface_pressure',
      'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'uv_index', 'visibility',
    ].join(','),
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'sunrise', 'sunset', 'precipitation_probability_max',
      'uv_index_max', 'precipitation_sum', 'wind_speed_10m_max',
    ].join(','),
    timezone:     'auto',
    forecast_days: '7',
  })

  const url = `${APP_CONFIG.WEATHER_API_BASE}?${params}`
  const res = await fetch(url, { next: { revalidate: APP_CONFIG.CACHE_MINUTES * 60 } })
  if (!res.ok) throw new Error(`Weather API error: ${res.status} ${res.statusText}`)
  return res.json()
}

/* ─── Geocoding: Search ────────────────────────────────────────────────────── */
export async function searchLocations(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []
  const params = new URLSearchParams({ name: query, count: '8', language: 'en', format: 'json' })
  const res = await fetch(`${APP_CONFIG.GEO_API_BASE}?${params}`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.results ?? []).map((x: Record<string, unknown>) => ({
    id:      x.id as number,
    name:    x.name as string,
    country: ((x.country_code as string) ?? '').toUpperCase(),
    region:  (x.admin1 as string) ?? '',
    lat:     x.latitude as number,
    lon:     x.longitude as number,
  }))
}

/* ─── Geocoding: Reverse (coords → city name) ──────────────────────────────── */
export async function reverseGeocode(lat: number, lon: number): Promise<Omit<Location, 'lat' | 'lon'>> {
  try {
    const url = `${APP_CONFIG.NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json`
    const res = await fetch(url, { headers: { 'User-Agent': 'AetherWeather/1.0' } })
    if (!res.ok) throw new Error()
    const data = await res.json()
    const a = data.address ?? {}
    return {
      city:    a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? 'Your Location',
      country: (a.country_code ?? '').toUpperCase(),
      region:  a.state ?? a.county ?? '',
    }
  } catch {
    return { city: 'Your Location', country: '', region: '' }
  }
}

/* ─── Fallback / Mock ──────────────────────────────────────────────────────── */
export function getMockWeather(): WeatherApiResponse {
  return MOCK_WEATHER
}

export function getMockLocation(): Location {
  return MOCK_LOCATION
}
