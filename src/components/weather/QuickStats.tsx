import type { WeatherCurrentData } from '@/types/weather'
import { GlassCard } from '@/components/ui/GlassCard'

interface QuickStatsProps {
  current: WeatherCurrentData
}

export function QuickStats({ current }: QuickStatsProps) {
  const stats = [
    { icon: '💧', value: `${current.relative_humidity_2m}%`, label: 'Humidity' },
    { icon: '🌬️', value: `${Math.round(current.wind_speed_10m)}`, label: 'km/h Wind' },
    { icon: '☁️',  value: `${current.cloud_cover}%`,             label: 'Cloud Cover' },
    { icon: '🔆', value: `${Math.round(current.uv_index)}`,      label: 'UV Index' },
  ]

  return (
    <GlassCard padding="none" animate="fade">
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px', background: 'var(--border)',
          borderRadius: 20, overflow: 'hidden',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center py-4 px-3 transition-colors duration-150"
            style={{ background: 'var(--surface-1)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-1)')}
          >
            <span style={{ fontSize: 16, marginBottom: 6 }} aria-hidden="true">{s.icon}</span>
            <span className="font-mono text-[17px]" style={{ color: 'var(--text-1)' }}>{s.value}</span>
            <span className="text-[10px] tracking-[0.1em] uppercase mt-1" style={{ color: 'var(--text-3)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
