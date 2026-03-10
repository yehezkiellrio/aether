import type { WeatherDailyData } from '@/types/weather'
import { GlassCard, SectionHeader } from '@/components/ui/GlassCard'
import { formatTime, dayProgress, clamp } from '@/lib/utils/format'

interface SunMoonCardProps {
  daily: WeatherDailyData
}

export function SunMoonCard({ daily }: SunMoonCardProps) {
  const rise    = daily.sunrise?.[0]
  const set     = daily.sunset?.[0]
  const prog    = rise && set ? dayProgress(rise, set) : 0
  const pctFmt  = `${(clamp(prog, 0, 1) * 100).toFixed(1)}%`
  const isDaylight = prog > 0 && prog < 1

  // Moonrise is roughly 12h offset from sunrise (simplified)
  const moonriseH = rise ? new Date(rise) : null
  if (moonriseH) moonriseH.setHours(moonriseH.getHours() + 12)

  return (
    <GlassCard animate="slide" delay={150}>
      <SectionHeader label="Sun & Moon" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Sunrise */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 26 }} aria-hidden="true">🌅</span>
          <div>
            <div className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--text-3)' }}>
              Sunrise
            </div>
            <div className="font-mono text-[18px]" style={{ color: 'var(--text-1)' }}>
              {formatTime(rise)}
            </div>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 26 }} aria-hidden="true">🌇</span>
          <div>
            <div className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--text-3)' }}>
              Sunset
            </div>
            <div className="font-mono text-[18px]" style={{ color: 'var(--text-1)' }}>
              {formatTime(set)}
            </div>
          </div>
        </div>

        {/* Day progress bar */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div
            style={{
              height: 4, borderRadius: 2,
              background: 'var(--border)',
              position: 'relative', overflow: 'visible',
            }}
          >
            <div
              style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: pctFmt, borderRadius: 2,
                background: 'linear-gradient(90deg, #FBB22D, #FF6B35, #FF3D5C)',
                transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
            {/* Sun position marker */}
            {isDaylight && (
              <div
                style={{
                  position: 'absolute', top: '50%',
                  left: pctFmt,
                  transform: 'translate(-50%, -50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: '#FBB22D',
                  border: '2px solid var(--bg-1)',
                  boxShadow: '0 0 8px rgba(251,178,45,0.5)',
                  transition: 'left 1s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            )}
          </div>
          <div
            className="flex justify-between mt-1.5 font-mono text-[10px]"
            style={{ color: 'var(--text-3)' }}
          >
            <span>{formatTime(rise)}</span>
            <span>{isDaylight ? `${Math.round(prog * 100)}% through daylight` : prog >= 1 ? 'After sunset' : 'Before sunrise'}</span>
            <span>{formatTime(set)}</span>
          </div>
        </div>

        {/* Moonrise (simplified) */}
        {moonriseH && (
          <div className="flex items-center gap-3" style={{ gridColumn: '1 / -1' }}>
            <span style={{ fontSize: 20 }} aria-hidden="true">🌙</span>
            <div className="text-[12px]" style={{ color: 'var(--text-3)' }}>
              Moonrise approx.{' '}
              <span className="font-mono" style={{ color: 'var(--text-2)' }}>
                {moonriseH.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
