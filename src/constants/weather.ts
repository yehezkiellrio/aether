import type {
  WeatherCodeMeta,
  SceneColors,
  DisasterConfig,
  DisasterType,
  WeatherScene,
} from '@/types/weather'

/* ─── WMO Weather Code Definitions ─────────────────────────────────────────── */
export const WEATHER_CODES: Record<number, WeatherCodeMeta> = {
  0:  { label: 'Clear Sky',            scene: 'clear',         icon: '☀️',  particleMode: 'none' },
  1:  { label: 'Mainly Clear',         scene: 'clear',         icon: '🌤️',  particleMode: 'none' },
  2:  { label: 'Partly Cloudy',        scene: 'partly-cloudy', icon: '⛅',  particleMode: 'none' },
  3:  { label: 'Overcast',             scene: 'overcast',      icon: '☁️',  particleMode: 'none' },
  45: { label: 'Foggy',                scene: 'fog',           icon: '🌫️',  particleMode: 'dust' },
  48: { label: 'Rime Fog',             scene: 'fog',           icon: '🌫️',  particleMode: 'dust' },
  51: { label: 'Light Drizzle',        scene: 'drizzle',       icon: '🌦️',  particleMode: 'drizzle' },
  53: { label: 'Drizzle',              scene: 'rain',          icon: '🌧️',  particleMode: 'rain' },
  55: { label: 'Heavy Drizzle',        scene: 'rain',          icon: '🌧️',  particleMode: 'rain-heavy' },
  61: { label: 'Light Rain',           scene: 'rain',          icon: '🌦️',  particleMode: 'rain' },
  63: { label: 'Moderate Rain',        scene: 'rain',          icon: '🌧️',  particleMode: 'rain' },
  65: { label: 'Heavy Rain',           scene: 'rain-heavy',    icon: '🌧️',  particleMode: 'rain-heavy' },
  71: { label: 'Light Snow',           scene: 'snow',          icon: '🌨️',  particleMode: 'snow' },
  73: { label: 'Moderate Snow',        scene: 'snow',          icon: '❄️',  particleMode: 'snow' },
  75: { label: 'Heavy Snow',           scene: 'snow',          icon: '❄️',  particleMode: 'snow-heavy' },
  77: { label: 'Snow Grains',          scene: 'snow',          icon: '🌨️',  particleMode: 'snow' },
  80: { label: 'Rain Showers',         scene: 'rain',          icon: '🌦️',  particleMode: 'rain' },
  81: { label: 'Showers',              scene: 'rain',          icon: '🌧️',  particleMode: 'rain' },
  82: { label: 'Heavy Showers',        scene: 'rain-heavy',    icon: '⛈️',  particleMode: 'rain-heavy' },
  85: { label: 'Snow Showers',         scene: 'snow',          icon: '🌨️',  particleMode: 'snow' },
  86: { label: 'Heavy Snow Showers',   scene: 'snow',          icon: '🌨️',  particleMode: 'snow-heavy' },
  95: { label: 'Thunderstorm',         scene: 'storm',         icon: '⛈️',  particleMode: 'storm' },
  96: { label: 'Thunderstorm',         scene: 'storm',         icon: '⛈️',  particleMode: 'storm' },
  99: { label: 'Severe Thunderstorm',  scene: 'storm',         icon: '⛈️',  particleMode: 'storm-heavy' },
}

export function getWeatherMeta(code: number): WeatherCodeMeta {
  return WEATHER_CODES[code] ?? WEATHER_CODES[0]
}

/* ─── Scene Color Palettes ──────────────────────────────────────────────────── */
export const SCENE_COLORS: Record<WeatherScene, SceneColors> = {
  'clear':         { top: '#0A1A32', mid: '#112240', bot: '#0D1A32', accent: 'rgba(251,178,45,0.15)', hasClouds: false, hasFog: false },
  'clear-night':   { top: '#020814', mid: '#04101E', bot: '#040C1A', accent: 'rgba(100,130,200,0.08)', hasClouds: false, hasFog: false },
  'partly-cloudy': { top: '#0E1F38', mid: '#162840', bot: '#111E32', accent: 'rgba(77,168,255,0.10)', hasClouds: true, hasFog: false },
  'overcast':      { top: '#1A1F2E', mid: '#202635', bot: '#1C2030', accent: 'rgba(100,120,150,0.08)', hasClouds: true, hasFog: false },
  'drizzle':       { top: '#0E1828', mid: '#141F30', bot: '#101825', accent: 'rgba(77,168,255,0.08)', hasClouds: true, hasFog: false },
  'rain':          { top: '#0A1422', mid: '#101A2A', bot: '#0C1420', accent: 'rgba(50,120,200,0.10)', hasClouds: true, hasFog: false },
  'rain-heavy':    { top: '#08101E', mid: '#0C1525', bot: '#0A1220', accent: 'rgba(40,100,180,0.12)', hasClouds: true, hasFog: false },
  'snow':          { top: '#0C1628', mid: '#121E30', bot: '#0E1A2C', accent: 'rgba(180,220,255,0.08)', hasClouds: true, hasFog: false },
  'fog':           { top: '#141A24', mid: '#1A2030', bot: '#161C28', accent: 'rgba(130,150,180,0.08)', hasClouds: false, hasFog: true },
  'storm':         { top: '#0A0514', mid: '#130820', bot: '#0D0618', accent: 'rgba(100,60,200,0.12)', hasClouds: true, hasFog: false },
}

export function getSceneForCode(code: number, isDay: boolean): WeatherScene {
  const meta = getWeatherMeta(code)
  if (meta.scene === 'clear' && !isDay) return 'clear-night'
  return meta.scene
}

/* ─── Disaster Simulation Configs ──────────────────────────────────────────── */
export const DISASTER_CONFIGS: Record<DisasterType, DisasterConfig> = {
  thunderstorm: {
    label: 'Extreme Storm',
    icon: '⛈️',
    color: '#9B7AFF',
    severity: 5,
    wind: '185+ km/h',
    rain: '80+ mm/hr',
    desc: 'Severe multi-cell thunderstorm system with extreme electrical activity, damaging supercell winds, large hail, and catastrophic precipitation rates threatening infrastructure.',
    impacts: [
      'Structural damage to buildings and infrastructure',
      'Flash flooding across low-lying areas',
      'Power grid failure across wide area',
      'Dangerous lightning strike risk',
      'Downed trees and wind-driven debris',
    ],
  },
  flood: {
    label: 'Flood Warning',
    icon: '🌊',
    color: '#4DA8FF',
    severity: 4,
    wind: '45 km/h',
    rain: '120 mm / 6hr',
    desc: 'Critical riverine and surface flood event from extended precipitation saturating ground systems. Water levels approaching or breaching critical management thresholds.',
    impacts: [
      'Road and bridge closures across network',
      'Residential and commercial inundation risk',
      'Waterborne pathogen contamination',
      'Evacuation route compromise',
      'Agricultural and livestock losses',
    ],
  },
  cyclone: {
    label: 'Cyclone Track',
    icon: '🌀',
    color: '#60EFFF',
    severity: 5,
    wind: '220+ km/h',
    rain: 'Continuous',
    desc: 'Category 4+ tropical cyclone tracking toward coastline with destructive sustained core winds, catastrophic storm surge potential, and extensive outer rainfall bands.',
    impacts: [
      'Mass evacuation of coastal zones required',
      'Complete infrastructure disruption',
      'Storm surge coastal inundation 4-6m',
      'Weeks-long power restoration timeline',
      'Search and rescue operations required',
    ],
  },
  heatwave: {
    label: 'Extreme Heat',
    icon: '🔥',
    color: '#FF6B35',
    severity: 3,
    wind: '< 10 km/h',
    rain: '0 mm',
    desc: 'Multi-day extreme heat event with dangerous temperature and humidity combination creating life-threatening heat index conditions for vulnerable populations.',
    impacts: [
      'Heat stroke and exhaustion — medical emergency risk',
      'Power grid demand surge and rolling blackouts',
      'Agricultural crop stress and livestock fatalities',
      'Wildfire danger at extreme levels',
      'Outdoor and physical activity prohibited',
    ],
  },
  blizzard: {
    label: 'Blizzard Conditions',
    icon: '❄️',
    color: '#B8E0F7',
    severity: 4,
    wind: '95 km/h',
    rain: '50+ cm snow',
    desc: 'Severe blizzard with whiteout visibility, life-threatening wind chill, and rapid heavy accumulation overwhelming snow removal capacity.',
    impacts: [
      'Road network closure and vehicle stranding',
      'Roof collapse risk under heavy load',
      'Hypothermia danger for exposed individuals',
      'Supply chain and emergency service disruption',
      'Power line ice loading and outages',
    ],
  },
}

/* ─── UV Index Scale ────────────────────────────────────────────────────────── */
export const UV_LEVELS = [
  { max: 2,   label: 'Low',         color: '#00E676' },
  { max: 5,   label: 'Moderate',    color: '#FDD835' },
  { max: 7,   label: 'High',        color: '#FF9800' },
  { max: 10,  label: 'Very High',   color: '#FF5722' },
  { max: Infinity, label: 'Extreme', color: '#FF1744' },
]

export function getUvInfo(uv: number) {
  return UV_LEVELS.find(l => uv <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1]
}

/* ─── Wind Direction ────────────────────────────────────────────────────────── */
export const WIND_DIRS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

export function getWindDir(deg: number): string {
  return WIND_DIRS[Math.round(deg / 22.5) % 16]
}

/* ─── App Config ────────────────────────────────────────────────────────────── */
export const APP_CONFIG = {
  WEATHER_API_BASE: 'https://api.open-meteo.com/v1/forecast',
  GEO_API_BASE:     'https://geocoding-api.open-meteo.com/v1/search',
  NOMINATIM_BASE:   'https://nominatim.openstreetmap.org',
  CACHE_MINUTES:    10,
  MAX_RECENT_LOCS:  5,
  DEFAULT_LAT:      51.5074,
  DEFAULT_LON:     -0.1278,
  DEFAULT_CITY:    'London',
} as const
