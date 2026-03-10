'use client'

import { SectionHeader, GlassCard } from '@/components/ui/GlassCard'
import { DISASTER_CONFIGS } from '@/constants/weather'
import type { DisasterType } from '@/types/weather'

interface DisasterPanelProps {
  active:       boolean
  type:         DisasterType | null
  onToggle:     () => void
  onTypeSelect: (t: DisasterType) => void
}

export function DisasterPanel({ active, type, onToggle, onTypeSelect }: DisasterPanelProps) {
  const cfg = type ? DISASTER_CONFIGS[type] : null

  return (
    <div className="animate-slide-up delay-300">
      <SectionHeader label="Simulation" />

      {/* Trigger button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-[14px]
                   transition-all duration-200 font-medium text-[13px] tracking-[0.03em]"
        style={{
          border: active ? '1px solid rgba(255,91,122,0.6)' : '1px solid rgba(255,91,122,0.3)',
          background: active ? 'rgba(255,91,122,0.12)' : 'rgba(255,91,122,0.05)',
          color: active ? '#FF8FA3' : 'var(--text-2)',
        }}
        aria-expanded={active}
        aria-label={active ? 'Exit disaster simulation' : 'Open disaster simulation'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke={active ? '#FF5B7A' : 'var(--text-3)'} strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        {active ? 'Exit Simulation Mode' : 'Disaster Simulation Mode'}
      </button>

      {/* Panel contents */}
      {active && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>

          {/* Simulation warning banner */}
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[11px] font-medium tracking-[0.06em] uppercase"
            style={{
              background: 'rgba(255,91,122,0.08)',
              border: '1px solid rgba(255,91,122,0.22)',
              color: '#FF8FA3',
            }}
            role="alert"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Simulation Only — Not Real Weather Data — For Educational Purposes
          </div>

          {/* Type selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(Object.keys(DISASTER_CONFIGS) as DisasterType[]).map(k => {
              const c = DISASTER_CONFIGS[k]
              return (
                <button
                  key={k}
                  onClick={() => onTypeSelect(k)}
                  className="px-3.5 py-2 rounded-[8px] text-[12px] font-medium transition-all duration-200"
                  style={{
                    border: type === k ? '1px solid rgba(255,91,122,0.45)' : '1px solid var(--border)',
                    background: type === k ? 'rgba(255,91,122,0.14)' : 'var(--surface-1)',
                    color: type === k ? '#FF8FA3' : 'var(--text-2)',
                    cursor: 'pointer',
                  }}
                  aria-pressed={type === k}
                >
                  {c.icon} {c.label}
                </button>
              )
            })}
          </div>

          {/* Details for selected type */}
          {cfg && type && (
            <>
              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoCard label="Severity Level" value={`${cfg.severity} / 5`}>
                  <SeverityBar level={cfg.severity} />
                </InfoCard>
                <InfoCard label="Simulated Wind" value={cfg.wind} />
                <InfoCard label="Precipitation"  value={cfg.rain} />
                <InfoCard label="Category"       value={cfg.label} />
              </div>

              {/* Description & impacts */}
              <GlassCard padding="md">
                <div className="text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--text-3)' }}>
                  Scenario
                </div>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>
                  {cfg.desc}
                </p>

                <div className="text-[10px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--text-3)' }}>
                  Potential Impacts
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cfg.impacts.map((impact, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[12px]" style={{ color: 'var(--text-2)' }}>
                      <span
                        style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: cfg.color, flexShrink: 0, marginTop: 4,
                        }}
                        aria-hidden="true"
                      />
                      {impact}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Radar placeholder */}
              <GlassCard padding="none" className="overflow-hidden">
                <div
                  style={{
                    height: 160,
                    background: `radial-gradient(ellipse at 50% 50%, ${cfg.color}18 0%, transparent 70%)`,
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {/* Simulated radar rings */}
                  {[1, 2, 3, 4].map(r => (
                    <div
                      key={r}
                      style={{
                        position: 'absolute',
                        width: r * 60, height: r * 40,
                        borderRadius: '50%',
                        border: `1px solid ${cfg.color}30`,
                      }}
                    />
                  ))}
                  {/* Rotating sweep */}
                  <div
                    style={{
                      position: 'absolute',
                      width: 120, height: 80, borderRadius: '50%',
                      background: `conic-gradient(from 0deg, ${cfg.color}20, transparent 60deg, transparent)`,
                      animation: 'sunRay 4s linear infinite',
                    }}
                  />
                  <div className="text-[11px] font-mono z-10 px-3 py-1.5 rounded-md"
                       style={{
                         background: 'rgba(0,0,0,0.4)',
                         border: `1px solid ${cfg.color}40`,
                         color: cfg.color,
                         letterSpacing: '0.1em',
                       }}>
                    SIMULATED RADAR
                  </div>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ────────────────────────────────────────────────────────── */
function InfoCard({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '14px 16px', borderRadius: 14,
        background: 'var(--surface-1)', border: '1px solid var(--border)',
      }}
    >
      <div className="text-[10px] uppercase tracking-[0.12em] mb-1.5" style={{ color: 'var(--text-3)' }}>
        {label}
      </div>
      <div className="text-[15px] font-medium" style={{ color: 'var(--text-1)' }}>{value}</div>
      {children}
    </div>
  )
}

function SeverityBar({ level }: { level: number }) {
  const COLORS = ['#00E676', '#B2FF59', '#FDD835', '#FF5722', '#FF1744']
  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i < level ? COLORS[i] : 'var(--border)',
            transition: `background 0.3s ${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  )
}
