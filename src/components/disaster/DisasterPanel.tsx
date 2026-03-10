'use client'

import dynamic from 'next/dynamic'
import { SectionHeader, GlassCard } from '@/components/ui/GlassCard'
import { DISASTER_CONFIGS } from '@/constants/weather'
import type { DisasterType, Location } from '@/types/weather'

/* Dynamically import the map (no SSR — Leaflet requires browser APIs) */
const DisasterMap = dynamic(
  () => import('./DisasterMap').then(m => m.DisasterMap),
  {
    ssr:     false,
    loading: () => (
      <div style={{
        height: 240,
        borderRadius: 14,
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-3)',
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
      }}>
        LOADING MAP…
      </div>
    ),
  }
)

interface DisasterPanelProps {
  active:       boolean
  type:         DisasterType | null
  location:     Location | null
  onToggle:     () => void
  onTypeSelect: (t: DisasterType) => void
}

export function DisasterPanel({ active, type, location, onToggle, onTypeSelect }: DisasterPanelProps) {
  const cfg = type ? DISASTER_CONFIGS[type] : null

  return (
    <div className="animate-slide-up delay-300">
      <SectionHeader label="Simulation" />

      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-[14px]
                   transition-all duration-200 font-medium text-[13px] tracking-[0.03em]"
        style={{
          border:     active ? '1px solid rgba(255,91,122,0.6)' : '1px solid rgba(255,91,122,0.3)',
          background: active ? 'rgba(255,91,122,0.12)' : 'rgba(255,91,122,0.05)',
          color:      active ? '#FF8FA3' : 'var(--text-2)',
        }}
        aria-expanded={active}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke={active ? '#FF5B7A' : 'var(--text-3)'} strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        {active ? 'Exit Simulation Mode' : 'Disaster Simulation Mode'}
      </button>

      {active && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>

          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[11px] font-medium tracking-[0.06em] uppercase"
            style={{ background: 'rgba(255,91,122,0.08)', border: '1px solid rgba(255,91,122,0.22)', color: '#FF8FA3' }}
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

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(Object.keys(DISASTER_CONFIGS) as DisasterType[]).map(k => {
              const c = DISASTER_CONFIGS[k]
              return (
                <button
                  key={k}
                  onClick={() => onTypeSelect(k)}
                  className="px-3.5 py-2 rounded-[8px] text-[12px] font-medium transition-all duration-200"
                  style={{
                    border:     type === k ? '1px solid rgba(255,91,122,0.45)' : '1px solid var(--border)',
                    background: type === k ? 'rgba(255,91,122,0.14)' : 'var(--surface-1)',
                    color:      type === k ? '#FF8FA3' : 'var(--text-2)',
                    cursor:     'pointer',
                  }}
                  aria-pressed={type === k}
                >
                  {c.icon} {c.label}
                </button>
              )
            })}
          </div>

          {cfg && type && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoCard label="Severity Level" value={`${cfg.severity} / 5`}>
                  <SeverityBar level={cfg.severity} />
                </InfoCard>
                <InfoCard label="Simulated Wind" value={cfg.wind} />
                <InfoCard label="Precipitation"  value={cfg.rain} />
                <InfoCard label="Category"       value={cfg.label} />
              </div>

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
                      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.color, flexShrink:0, marginTop:4 }} aria-hidden="true" />
                      {impact}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* ── REAL MAP ─────────────────────────────────────────────── */}
              <GlassCard padding="none" className="overflow-hidden">
                {location ? (
                  <DisasterMap
                    lat={location.lat}
                    lon={location.lon}
                    cityName={location.city}
                    disasterType={type}
                  />
                ) : (
                  <div style={{
                    height:240, display:'flex', alignItems:'center', justifyContent:'center',
                    flexDirection:'column', gap:8, color:'var(--text-3)', fontSize:13,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="10" r="3"/>
                      <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z"/>
                    </svg>
                    <span>Select a location to view the map</span>
                  </div>
                )}
              </GlassCard>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div style={{ padding:'14px 16px', borderRadius:14, background:'var(--surface-1)', border:'1px solid var(--border)' }}>
      <div className="text-[10px] uppercase tracking-[0.12em] mb-1.5" style={{ color:'var(--text-3)' }}>{label}</div>
      <div className="text-[15px] font-medium" style={{ color:'var(--text-1)' }}>{value}</div>
      {children}
    </div>
  )
}

function SeverityBar({ level }: { level: number }) {
  const COLORS = ['#00E676','#B2FF59','#FDD835','#FF5722','#FF1744']
  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ flex:1, height:6, borderRadius:3, background: i < level ? COLORS[i] : 'var(--border)', transition:`background 0.3s ${i*0.05}s` }} />
      ))}
    </div>
  )
}
