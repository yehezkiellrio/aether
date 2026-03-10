import type { WeatherDailyData } from '@/types/weather'
import { GlassCard, SectionHeader } from '@/components/ui/GlassCard'
import { getWeatherMeta } from '@/constants/weather'
import { displayTemp, formatDayLabel } from '@/lib/utils/format'

interface DailyForecastProps {
  daily: WeatherDailyData
  unit:  'C' | 'F'
}

export function DailyForecast({ daily, unit }: DailyForecastProps) {
  const allMax = daily.temperature_2m_max ?? []
  const allMin = daily.temperature_2m_min ?? []
  const gMin   = Math.min(...allMin)
  const gMax   = Math.max(...allMax)
  const spread = gMax - gMin || 1

  return (
    <GlassCard animate="slide" delay={250}>
      <SectionHeader label="7-Day Forecast" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(daily.time ?? []).map((t, i) => {
          const code  = daily.weather_code?.[i] ?? 0
          const wm    = getWeatherMeta(code)
          const mn    = daily.temperature_2m_min?.[i] ?? 0
          const mx    = daily.temperature_2m_max?.[i] ?? 0
          const rain  = daily.precipitation_probability_max?.[i] ?? 0
          const precip = daily.precipitation_sum?.[i] ?? 0

          // Temp range bar positioning
          const barLeft = Math.round(((mn - gMin) / spread) * 100)
          const barW    = Math.max(8, Math.round(((mx - mn) / spread) * 100))

          return (
            <div
              key={t}
              className="flex items-center gap-3 px-2 py-3 rounded-[8px] transition-colors duration-150"
              style={{ cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Day name */}
              <span className="text-[13px] w-12 flex-shrink-0" style={{ color: 'var(--text-2)' }}>
                {formatDayLabel(t, i)}
              </span>

              {/* Icon */}
              <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">{wm.icon}</span>

              {/* Condition */}
              <span
                className="flex-1 text-[12px] truncate min-w-0 hidden sm:block"
                style={{ color: 'var(--text-3)' }}
              >
                {wm.label}
              </span>

              {/* Rain chance */}
              <span
                className="font-mono text-[11px] w-8 text-right flex-shrink-0"
                style={{ color: rain > 30 ? '#4DA8FF' : 'var(--text-3)' }}
              >
                {rain > 10 ? `${rain}%` : ''}
              </span>

              {/* Temp range */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-[13px] w-10 text-right" style={{ color: 'var(--text-3)' }}>
                  {displayTemp(mn, unit)}
                </span>
                <div
                  style={{
                    width: 60, height: 4, borderRadius: 2,
                    background: 'var(--border)', position: 'relative', overflow: 'hidden',
                  }}
                  aria-label={`Temperature range: ${displayTemp(mn, unit)} to ${displayTemp(mx, unit)}`}
                >
                  <div
                    style={{
                      position: 'absolute', top: 0, height: '100%',
                      left: `${barLeft}%`, width: `${barW}%`,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #4DA8FF, #FBB22D)',
                    }}
                  />
                </div>
                <span className="font-mono text-[13px] w-10" style={{ color: 'var(--text-1)' }}>
                  {displayTemp(mx, unit)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
