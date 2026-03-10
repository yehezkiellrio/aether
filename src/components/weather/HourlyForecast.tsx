'use client'

import { useRef, useEffect } from 'react'
import type { WeatherHourlyData, WeatherCurrentData } from '@/types/weather'
import { SectionHeader, GlassCard } from '@/components/ui/GlassCard'
import { getWeatherMeta } from '@/constants/weather'
import { displayTemp, formatHourLabel } from '@/lib/utils/format'

interface HourlyForecastProps {
  hourly:  WeatherHourlyData
  current: WeatherCurrentData
  unit:    'C' | 'F'
}

interface HourPoint {
  iso:    string
  time:   Date
  temp:   number
  rain:   number
  code:   number
  label:  string
}

function getNextHours(hourly: WeatherHourlyData, count = 24): HourPoint[] {
  const now    = new Date()
  const points: HourPoint[] = []
  for (let i = 0; i < hourly.time.length && points.length < count; i++) {
    const t = new Date(hourly.time[i])
    if (t >= now) {
      points.push({
        iso:   hourly.time[i],
        time:  t,
        temp:  hourly.temperature_2m[i],
        rain:  hourly.precipitation_probability[i],
        code:  hourly.weather_code[i],
        label: formatHourLabel(hourly.time[i]),
      })
    }
  }
  return points
}

/* ─── Canvas chart renderer ─────────────────────────────────────────────────── */
function drawChart(canvas: HTMLCanvasElement, data: HourPoint[], isDark: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx || !data.length) return
  const W   = canvas.offsetWidth
  const H   = canvas.offsetHeight || 140
  canvas.width  = W
  canvas.height = H
  if (W === 0) return

  const pad   = { l: 36, r: 16, t: 20, b: 28 }
  const cw    = W - pad.l - pad.r
  const ch    = H - pad.t - pad.b
  const temps = data.map(d => d.temp)
  const minT  = Math.min(...temps) - 2
  const maxT  = Math.max(...temps) + 2
  const tx    = (i: number) => pad.l + i * (cw / (data.length - 1))
  const ty    = (v: number) => pad.t + ch - ((v - minT) / (maxT - minT)) * ch

  const textC = isDark ? 'rgba(138,154,184,0.8)' : 'rgba(74,93,122,0.8)'
  const gridC = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

  // Grid lines
  for (let i = 0; i <= 3; i++) {
    const y = pad.t + (ch * i) / 3
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y)
    ctx.strokeStyle = gridC; ctx.lineWidth = 1; ctx.stroke()
  }

  // Rain probability bars
  data.forEach((d, i) => {
    if (d.rain > 5) {
      const bh = (d.rain / 100) * ch * 0.35
      const bx = tx(i) - 8
      const by = H - pad.b - bh
      ctx.fillStyle = 'rgba(77,168,255,0.12)'
      ctx.fillRect(bx, by, 16, bh)
    }
  })

  // Gradient area fill
  ctx.beginPath(); ctx.moveTo(tx(0), ty(temps[0]))
  for (let i = 1; i < data.length; i++) {
    const cx1 = tx(i - 1) + cw / (data.length - 1) * 0.5
    const cx2 = tx(i) - cw / (data.length - 1) * 0.5
    ctx.bezierCurveTo(cx1, ty(temps[i - 1]), cx2, ty(temps[i]), tx(i), ty(temps[i]))
  }
  ctx.lineTo(tx(data.length - 1), H - pad.b)
  ctx.lineTo(tx(0), H - pad.b)
  ctx.closePath()
  const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b)
  grad.addColorStop(0, 'rgba(77,168,255,0.22)')
  grad.addColorStop(1, 'rgba(77,168,255,0)')
  ctx.fillStyle = grad; ctx.fill()

  // Line
  ctx.beginPath(); ctx.moveTo(tx(0), ty(temps[0]))
  for (let i = 1; i < data.length; i++) {
    const cx1 = tx(i - 1) + cw / (data.length - 1) * 0.5
    const cx2 = tx(i) - cw / (data.length - 1) * 0.5
    ctx.bezierCurveTo(cx1, ty(temps[i - 1]), cx2, ty(temps[i]), tx(i), ty(temps[i]))
  }
  ctx.strokeStyle = 'rgba(77,168,255,0.85)'; ctx.lineWidth = 2; ctx.stroke()

  // Labels
  ctx.font = '10px var(--font-dm-mono, monospace)'
  ctx.fillStyle = textC; ctx.textAlign = 'center'
  data.forEach((d, i) => {
    if (i % 3 === 0) {
      ctx.fillText(d.label, tx(i), H - 8)
      ctx.fillText(`${Math.round(d.temp)}°`, tx(i), ty(temps[i]) - 8)
    }
  })

  // "Now" indicator
  const now     = new Date()
  const curIdx  = data.findIndex(d => d.time >= now)
  if (curIdx > 0) {
    const cx = tx(curIdx)
    ctx.beginPath(); ctx.moveTo(cx, pad.t); ctx.lineTo(cx, H - pad.b)
    ctx.strokeStyle = 'rgba(251,178,45,0.4)'; ctx.lineWidth = 1
    ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([])
    ctx.beginPath(); ctx.arc(cx, ty(temps[curIdx]), 4, 0, Math.PI * 2)
    ctx.fillStyle = '#FBB22D'; ctx.fill()
  }
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export function HourlyForecast({ hourly, current, unit }: HourlyForecastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const points    = getNextHours(hourly, 24)
  const chartPts  = points.slice(0, 12)

  // Draw chart after render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const draw = () => drawChart(canvas, chartPts, isDark)
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [chartPts])

  return (
    <div className="animate-slide-up delay-200">
      <SectionHeader label="Hourly Forecast" />

      {/* Chart card */}
      <GlassCard padding="sm" className="mb-3">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 140, display: 'block' }}
          aria-label="Temperature and rain probability chart for next 12 hours"
        />
        <div className="flex items-center gap-4 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <div style={{ width: 12, height: 2, borderRadius: 1, background: 'rgba(77,168,255,0.85)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>Temperature</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 12, height: 8, borderRadius: 2, background: 'rgba(77,168,255,0.15)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>Rain probability</span>
          </div>
        </div>
      </GlassCard>

      {/* Scrollable hour cards */}
      <div
        style={{ overflowX: 'auto', margin: '0 -4px', WebkitOverflowScrolling: 'touch' }}
        className="scrollbar-none"
      >
        <div style={{ display: 'flex', gap: 8, padding: '4px', minWidth: 'max-content' }}>
          {points.map((p, i) => {
            const wm      = getWeatherMeta(p.code)
            const isCur   = i === 0
            const timeStr = i === 0 ? 'Now' : p.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            return (
              <div
                key={p.iso}
                style={{
                  width: 64, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '12px 8px', borderRadius: 14,
                  background: isCur ? 'rgba(77,168,255,0.1)' : 'var(--surface-1)',
                  border: `1px solid ${isCur ? 'rgba(77,168,255,0.3)' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
              >
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{timeStr}</span>
                <span style={{ fontSize: 18 }} aria-hidden="true">{wm.icon}</span>
                <span className="font-mono" style={{ fontSize: 13, color: 'var(--text-1)' }}>
                  {displayTemp(p.temp, unit)}
                </span>
                <span style={{ fontSize: 10, color: '#4DA8FF', minHeight: 14 }}>
                  {p.rain > 10 ? `${p.rain}%` : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
