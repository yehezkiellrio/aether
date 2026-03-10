'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { ParticleMode } from '@/types/weather'

interface Particle {
  x: number; y: number; vx: number; vy: number
  r: number; a: number; len?: number
  swing?: number; swingSpd?: number
  da?: number; type: 'rain' | 'snow' | 'star' | 'dust'
}

/* ─── Particle System Hook ──────────────────────────────────────────────────── */
export function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const modeRef    = useRef<ParticleMode>('none')
  const rafRef     = useRef<number | null>(null)
  const psRef      = useRef<Particle[]>([])

  const getCount = (mode: ParticleMode): number => {
    const map: Partial<Record<ParticleMode, number>> = {
      drizzle: 80, rain: 200, 'rain-heavy': 320, storm: 400, 'storm-heavy': 480,
      snow: 100, 'snow-heavy': 200, dust: 60, stars: 160,
    }
    return map[mode] ?? 0
  }

  const spawnParticle = useCallback((W: number, H: number, mode: ParticleMode, initial = false): Particle | null => {
    if (mode === 'stars') {
      return { x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0,
        r: Math.random() * 1.5 + 0.3, a: Math.random(), da: 0.003 + Math.random() * 0.005, type: 'star' }
    }
    if (mode === 'dust') {
      return { x: Math.random() * W, y: initial ? Math.random() * H : -10,
        vx: (Math.random() - 0.5) * 0.5, vy: 0.2 + Math.random() * 0.4,
        r: Math.random() * 2 + 1, a: Math.random() * 0.15 + 0.05, type: 'dust' }
    }
    if (mode === 'snow' || mode === 'snow-heavy') {
      const heavy = mode === 'snow-heavy'
      return { x: Math.random() * W, y: initial ? Math.random() * H : -10,
        vx: (Math.random() - 0.5) * (heavy ? 1.5 : 0.8), vy: 1 + Math.random() * (heavy ? 2.5 : 1.5),
        r: Math.random() * (heavy ? 4 : 3) + 1.5, a: 0.7 + Math.random() * 0.3,
        swing: Math.random() * Math.PI * 2, swingSpd: 0.02 + Math.random() * 0.02, type: 'snow' }
    }
    // rain variants
    const heavy = mode === 'rain-heavy' || mode === 'storm' || mode === 'storm-heavy'
    return {
      x: Math.random() * (W + 200) - 100, y: initial ? Math.random() * H : -20,
      vx: heavy ? -3 : -1.5, vy: heavy ? 22 : 14,
      len: heavy ? 22 : 14, r: 0, a: heavy ? 0.25 : 0.18, type: 'rain',
    }
  }, [])

  const loop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    const mode = modeRef.current
    ctx.clearRect(0, 0, W, H)

    // Top up particles
    const target = getCount(mode)
    while (psRef.current.length < target) {
      const p = spawnParticle(W, H, mode)
      if (p) psRef.current.push(p)
    }

    psRef.current = psRef.current.filter(p => {
      if (p.type === 'star') {
        p.a += p.da!; if (p.a > 1 || p.a < 0) p.da! *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${p.a})`; ctx.fill()
        return true
      }
      if (p.type === 'dust') {
        p.x += p.vx; p.y += p.vy
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,190,210,${p.a})`; ctx.fill()
        return p.y < H + 10
      }
      if (p.type === 'snow') {
        p.swing! += p.swingSpd!; p.x += Math.sin(p.swing!) * 0.8 + p.vx; p.y += p.vy
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,235,255,${p.a})`; ctx.fill()
        return p.y < H + 10
      }
      // rain
      p.x += p.vx; p.y += p.vy
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 0.8, p.y - p.len!)
      ctx.strokeStyle = `rgba(160,200,255,${p.a})`; ctx.lineWidth = 1; ctx.stroke()
      return p.y < H + 30 && p.x > -100 && p.x < W + 100
    })

    // Lightning flash for storms
    if ((mode === 'storm' || mode === 'storm-heavy') && Math.random() < 0.003) {
      ctx.fillStyle = 'rgba(180,140,255,0.06)'; ctx.fillRect(0, 0, W, H)
      if (Math.random() < 0.5) {
        const lx = Math.random() * W
        ctx.beginPath(); ctx.moveTo(lx, 0)
        let cy = 0, cx = lx
        while (cy < H * 0.7) { const seg = 30 + Math.random() * 60; cy += seg; cx += (Math.random() - 0.5) * 40; ctx.lineTo(cx, cy) }
        ctx.strokeStyle = 'rgba(220,200,255,0.8)'; ctx.lineWidth = 1.5; ctx.stroke()
      }
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [canvasRef, spawnParticle])

  const setMode = useCallback((mode: ParticleMode) => {
    modeRef.current = mode
    psRef.current = []
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (mode === 'none') {
      const canvas = canvasRef.current
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.width, H = canvas.height
    const count = getCount(mode)
    for (let i = 0; i < count; i++) {
      const p = spawnParticle(W, H, mode, true)
      if (p) psRef.current.push(p)
    }
    loop()
  }, [canvasRef, spawnParticle, loop])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvas.offsetWidth  || window.innerWidth
    canvas.height = canvas.offsetHeight || window.innerHeight
    // Respawn particles
    const mode = modeRef.current
    if (mode !== 'none') setMode(mode)
  }, [canvasRef, setMode])

  useEffect(() => {
    resize()
    const ro = new ResizeObserver(resize)
    if (canvasRef.current) ro.observe(canvasRef.current.parentElement!)
    window.addEventListener('resize', resize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { setMode }
}
