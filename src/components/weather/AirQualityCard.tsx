import { GlassCard, SectionHeader } from '@/components/ui/GlassCard'

interface AirQualityProps {
  /** AQI value 0-500. When null, shows placeholder. */
  aqi?: number | null
}

function aqiMeta(v: number): { label: string; color: string; desc: string } {
  if (v <= 50)  return { label: 'Good',        color: '#00E676', desc: 'Air quality is satisfactory and poses little or no risk.' }
  if (v <= 100) return { label: 'Moderate',    color: '#FDD835', desc: 'Acceptable air quality. Some pollutants may be a concern for very sensitive people.' }
  if (v <= 150) return { label: 'Unhealthy (Sensitive)', color: '#FF9800', desc: 'Members of sensitive groups may experience health effects. General public is not likely to be affected.' }
  if (v <= 200) return { label: 'Unhealthy',   color: '#FF5722', desc: 'Everyone may begin to experience health effects. Sensitive groups at greater risk.' }
  if (v <= 300) return { label: 'Very Unhealthy', color: '#9C27B0', desc: 'Health alert: everyone may experience more serious health effects.' }
  return { label: 'Hazardous',   color: '#FF1744', desc: 'Health warnings of emergency conditions. Entire population is more likely to be affected.' }
}

export function AirQualityCard({ aqi }: AirQualityProps) {
  const mockAqi = aqi ?? 42
  const meta    = aqiMeta(mockAqi)
  const isPlaceholder = aqi == null

  return (
    <GlassCard animate="slide" delay={300}>
      <SectionHeader label="Air Quality" />
      {isPlaceholder && (
        <div
          className="text-[10px] mb-3 px-2 py-1 rounded-md inline-block"
          style={{
            background: 'rgba(251,178,45,0.08)',
            border: '1px solid rgba(251,178,45,0.2)',
            color: '#FBB22D', letterSpacing: '0.08em',
          }}
        >
          ESTIMATED — AQI API optional
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* AQI circle */}
        <div
          style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            border: `2px solid ${meta.color}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${meta.color}20`,
          }}
          aria-label={`AQI: ${mockAqi}`}
        >
          <span className="font-mono text-[19px]" style={{ color: meta.color, lineHeight: 1 }}>
            {mockAqi}
          </span>
          <span className="text-[8px] tracking-[0.1em] uppercase mt-0.5" style={{ color: 'var(--text-3)' }}>
            AQI
          </span>
        </div>

        <div>
          <div className="text-[16px] font-medium mb-1" style={{ color: 'var(--text-1)' }}>{meta.label}</div>
          <div className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{meta.desc}</div>
        </div>
      </div>

      {/* Pollutant indicators (estimated) */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16,
        }}
      >
        {[
          { label: 'PM2.5', value: '12 μg', status: 'Good' },
          { label: 'PM10',  value: '18 μg', status: 'Good' },
          { label: 'NO₂',   value: '24 ppb', status: 'Mod.' },
          { label: 'O₃',    value: '38 ppb', status: 'Good' },
          { label: 'CO',    value: '0.3 ppm', status: 'Good' },
          { label: 'SO₂',   value: '4 ppb',  status: 'Good' },
        ].map(p => (
          <div key={p.label}
               style={{
                 padding: '8px 10px', borderRadius: 10,
                 background: 'var(--surface-1)', border: '1px solid var(--border)',
               }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--text-3)' }}>{p.label}</div>
            <div className="font-mono text-[12px]" style={{ color: 'var(--text-1)' }}>{p.value}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
