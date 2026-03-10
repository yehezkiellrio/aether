import type { WeatherApiResponse } from '@/types/weather'

/* ─── Realistic Mock Data — London, UK ──────────────────────────────────────── */
function genDates(count: number, startHoursBack = 0): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setHours(d.getHours() - startHoursBack + i, 0, 0, 0)
    return d.toISOString()
  })
}

function genDailyDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

function genSunriseSet(count: number): { sunrise: string[]; sunset: string[] } {
  const sunrise = Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    d.setHours(6, 15, 0, 0)
    return d.toISOString()
  })
  const sunset = Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    d.setHours(18, 45, 0, 0)
    return d.toISOString()
  })
  return { sunrise, sunset }
}

const { sunrise, sunset } = genSunriseSet(7)
const hourlyTimes = genDates(48, 2) // 48 hours, starting 2h back

export const MOCK_WEATHER: WeatherApiResponse = {
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
  timezone_abbreviation: 'GMT',
  elevation: 25,
  current: {
    temperature_2m: 22,
    apparent_temperature: 24,
    relative_humidity_2m: 62,
    is_day: new Date().getHours() >= 6 && new Date().getHours() < 20 ? 1 : 0,
    precipitation: 0,
    weather_code: 2,
    cloud_cover: 35,
    pressure_msl: 1013,
    surface_pressure: 1010,
    wind_speed_10m: 14,
    wind_direction_10m: 225,
    wind_gusts_10m: 22,
    uv_index: 5,
    visibility: 25000,
  },
  hourly: {
    time: hourlyTimes,
    temperature_2m: [
      19, 18, 17, 17, 18, 20, 22, 24, 25, 26, 26, 25, 24, 23, 22, 21, 20, 19, 18, 18, 17, 17, 17, 18,
      19, 19, 18, 17, 18, 20, 23, 25, 26, 27, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 17, 18, 19,
    ],
    precipitation_probability: [
      5,  5,  5,  5,  5,  5,  5,  5, 10, 15, 20, 15, 10, 10, 15, 20, 25, 20, 15, 10,  5,  5,  5,  5,
      5,  5,  5,  5,  5,  5,  5, 10, 20, 30, 35, 30, 25, 20, 20, 25, 30, 25, 15, 10,  5,  5,  5,  5,
    ],
    weather_code: [
      1, 1, 1, 0, 0, 1, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1,
      1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1,
    ],
    wind_speed_10m: [
      10,  9,  8,  8,  9, 11, 13, 14, 15, 16, 15, 14, 14, 13, 14, 15, 14, 13, 12, 11, 10,  9,  9, 10,
      11, 10,  9,  8,  9, 12, 14, 15, 17, 18, 17, 16, 15, 14, 14, 15, 14, 13, 12, 11, 10,  9,  9, 10,
    ],
  },
  daily: {
    time: genDailyDates(7),
    weather_code: [2, 1, 0, 3, 61, 63, 2],
    temperature_2m_max: [26, 28, 30, 22, 19, 18, 23],
    temperature_2m_min: [16, 17, 18, 14, 13, 12, 15],
    sunrise,
    sunset,
    precipitation_probability_max: [10, 5, 5, 30, 75, 80, 25],
    uv_index_max: [5, 6, 7, 3, 2, 2, 4],
    precipitation_sum: [0, 0, 0, 2, 12, 18, 3],
    wind_speed_10m_max: [15, 12, 10, 20, 28, 25, 18],
  },
}

export const MOCK_LOCATION = {
  lat: 51.5074,
  lon: -0.1278,
  city: 'London',
  country: 'GB',
  region: 'England',
}
