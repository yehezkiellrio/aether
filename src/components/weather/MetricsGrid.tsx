import type { WeatherCurrentData, WeatherDailyData } from '@/types/weather'
import { SectionHeader, MetricCard } from '@/components/ui/GlassCard'
import { getUvInfo, getWindDir } from '@/constants/weather'
import { pressureTrend, formatVisibility, visibilityLabel } from '@/lib/utils/format'

interface MetricsGridProps {
  current: WeatherCurrentData
  daily:   WeatherDailyData
  unit:    'C' | 'F'
}

export function MetricsGrid({ current, daily, unit }: MetricsGridProps) {
  const uvData   = getUvInfo(current.uv_index)
  const uvPct    = Math.min(100, (current.uv_index / 11) * 100)
  const windDir  = getWindDir(current.wind_direction_10m)
  const pressure = current.pressure_msl ?? current.surface_pressure
  const pTrend   = pressureTrend(pressure)
  const visStr   = formatVisibility(current.visibility)
  const visLabel = visibilityLabel(current.visibility)

  return (
    <div className="animate-slide-up delay-100">
      <SectionHeader label="Conditions" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}
        className="sm:grid-cols-3 lg:grid-cols-4"
      >
        {/* Humidity */}
        <MetricCard
          icon="💧"
          iconBg="rgba(77,168,255,0.12)"
          value={<>{current.relative_humidity_2m}<small style={{ fontSize: 13 }}>%</small></>}
          label="Relative Humidity"
          sub={current.relative_humidity_2m > 70 ? 'High — condensation likely' : 'Comfortable range'}
        />

        {/* Wind */}
        <MetricCard
          icon="🌬️"
          iconBg="rgba(255,255,255,0.06)"
          value={<>{Math.round(current.wind_speed_10m)}<small style={{ fontSize: 12 }}> km/h</small></>}
          label="Wind Speed"
          sub={
            <span className="flex items-center gap-1.5">
              {/* Compass needle */}
              <span
                style={{
                  display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                  border: '1px solid var(--border)', position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute', width: 1.5, height: 6,
                    background: 'linear-gradient(180deg, var(--accent-blue), transparent)',
                    top: '50%', left: '50%', transformOrigin: 'bottom center',
                    transform: `translate(-50%, -100%) rotate(${current.wind_direction_10m}deg)`,
                    borderRadius: 1,
                  }}
                />
              </span>
              {windDir} · Gusts {Math.round(current.wind_gusts_10m)} km/h
            </span>
          }
        />

        {/* UV Index */}
        <MetricCard
          icon="🔆"
          iconBg="rgba(251,178,45,0.12)"
          value={current.uv_index.toFixed(1)}
          label={`UV Index · ${uvData.label}`}
          sub={
            <div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', marginTop: 4 }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${uvPct}%`,
                  background: `linear-gradient(90deg, #00E676, #FDD835, ${uvData.color})`,
                  transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>
          }
        />

        {/* Visibility */}
        <MetricCard
          icon="🔭"
          iconBg="rgba(160,100,255,0.12)"
          value={<>{visStr}</>}
          label="Visibility"
          sub={visLabel}
        />

        {/* Pressure */}
        <MetricCard
          icon="⬇️"
          iconBg="rgba(77,168,255,0.08)"
          value={<>{Math.round(pressure)}<small style={{ fontSize: 11 }}> hPa</small></>}
          label="Barometric Pressure"
          sub={`${pTrend.direction} ${pTrend.label}`}
        />

        {/* Precipitation */}
        <MetricCard
          icon="🌧️"
          iconBg="rgba(100,200,100,0.1)"
          value={<>{(current.precipitation ?? 0).toFixed(1)}<small style={{ fontSize: 12 }}> mm</small></>}
          label="Precipitation Now"
          sub={current.precipitation > 0 ? 'Currently raining' : 'Dry conditions'}
        />

        {/* Feels Like */}
        <MetricCard
          icon="🌡️"
          iconBg="rgba(255,150,50,0.1)"
          value={
            <span>
              {Math.round(unit === 'F'
                ? current.apparent_temperature * 9 / 5 + 32
                : current.apparent_temperature)}°
            </span>
          }
          label="Apparent Temperature"
          sub={
            current.apparent_temperature < current.temperature_2m
              ? `${Math.abs(Math.round(current.apparent_temperature - current.temperature_2m))}° cooler with wind`
              : `${Math.abs(Math.round(current.apparent_temperature - current.temperature_2m))}° warmer with humidity`
          }
        />

        {/* Cloud Cover */}
        <MetricCard
          icon="☁️"
          iconBg="rgba(255,255,255,0.06)"
          value={<>{current.cloud_cover}<small style={{ fontSize: 12 }}>%</small></>}
          label="Cloud Cover"
          sub={
            current.cloud_cover < 20 ? 'Clear sky' :
            current.cloud_cover < 50 ? 'Partly cloudy' :
            current.cloud_cover < 80 ? 'Mostly cloudy' : 'Overcast'
          }
        />
      </div>
    </div>
  )
}
