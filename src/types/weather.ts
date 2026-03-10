/* ─── Aether Weather — TypeScript Types ─────────────────────────────────────── */

/** WMO weather code (0-99) */
export type WeatherCode = number

/** Temperature unit preference */
export type TemperatureUnit = 'C' | 'F'

/** Application theme */
export type Theme = 'dark' | 'light'

/** Weather scene identifier */
export type WeatherScene =
  | 'clear'
  | 'clear-night'
  | 'partly-cloudy'
  | 'overcast'
  | 'drizzle'
  | 'rain'
  | 'rain-heavy'
  | 'snow'
  | 'fog'
  | 'storm'

/** Particle animation mode */
export type ParticleMode =
  | 'none'
  | 'stars'
  | 'dust'
  | 'drizzle'
  | 'rain'
  | 'rain-heavy'
  | 'snow'
  | 'snow-heavy'
  | 'storm'
  | 'storm-heavy'

/** Disaster simulation type */
export type DisasterType = 'thunderstorm' | 'flood' | 'cyclone' | 'heatwave' | 'blizzard'

/** ── Open-Meteo API Response ─────────────────────────────────────────────── */
export interface WeatherCurrentData {
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  is_day: 0 | 1
  precipitation: number
  weather_code: WeatherCode
  cloud_cover: number
  pressure_msl: number
  surface_pressure: number
  wind_speed_10m: number
  wind_direction_10m: number
  wind_gusts_10m: number
  uv_index: number
  visibility: number
}

export interface WeatherHourlyData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  weather_code: number[]
  wind_speed_10m: number[]
}

export interface WeatherDailyData {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_probability_max: number[]
  uv_index_max: number[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
}

export interface WeatherApiResponse {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current: WeatherCurrentData
  hourly: WeatherHourlyData
  daily: WeatherDailyData
}

/** ── Location ────────────────────────────────────────────────────────────── */
export interface Location {
  lat: number
  lon: number
  city: string
  country: string
  region: string
}

export interface SearchResult {
  id: number
  name: string
  country: string
  region: string
  lat: number
  lon: number
}

/** ── Weather Code Metadata ───────────────────────────────────────────────── */
export interface WeatherCodeMeta {
  label: string
  scene: WeatherScene
  icon: string
  particleMode: ParticleMode
}

/** ── Disaster Simulation ─────────────────────────────────────────────────── */
export interface DisasterConfig {
  label: string
  icon: string
  color: string
  severity: 1 | 2 | 3 | 4 | 5
  wind: string
  rain: string
  desc: string
  impacts: string[]
}

/** ── App State ───────────────────────────────────────────────────────────── */
export interface AppState {
  weather: WeatherApiResponse | null
  location: Location | null
  loading: boolean
  error: Error | null
  permissionDenied: boolean
  isOffline: boolean
  disasterMode: boolean
  disasterType: DisasterType | null
  theme: Theme
  unit: TemperatureUnit
  recentLocations: Location[]
  useMockData: boolean
  lastUpdated: Date | null
}

/** ── Hourly Chart Data Point ─────────────────────────────────────────────── */
export interface ChartDataPoint {
  iso: string
  time: Date
  temp: number
  rain: number
  label: string
  weatherCode: WeatherCode
}

/** ── Scene Color Config ──────────────────────────────────────────────────── */
export interface SceneColors {
  top: string
  mid: string
  bot: string
  accent: string
  hasClouds: boolean
  hasFog: boolean
}
