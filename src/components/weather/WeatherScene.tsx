'use client'

import { useRef, useEffect } from 'react'
import { useParticles } from '@/hooks/useParticles'
import type { WeatherApiResponse, DisasterType, ParticleMode } from '@/types/weather'
import { getWeatherMeta, getSceneForCode, SCENE_COLORS, DISASTER_CONFIGS } from '@/constants/weather'
import { displayTemp, formatTimeShort } from '@/lib/utils/format'

interface WeatherSceneProps {
  weather:      WeatherApiResponse | null
  unit:         'C' | 'F'
  disasterMode: boolean
  disasterType: DisasterType | null
  loading:      boolean
}

const DISASTER_SCENE_COLORS: Record<DisasterType, { top: string; mid: string; bot: string }> = {
  thunderstorm: { top: '#080512', mid: '#0F081A', bot: '#0A0514' },
  flood:        { top: '#050F20', mid: '#0A1525', bot: '#081220' },
  cyclone:      { top: '#040D18', mid: '#071520', bot: '#050E18' },
  heatwave:     { top: '#1A0800', mid: '#250C00', bot: '#1E0900' },
  blizzard:     { top: '#0A1020', mid: '#101828', bot: '#0C1422' },
}

const DISASTER_PARTICLE_MODES: Record<DisasterType, ParticleMode> = {
  thunderstorm: 'storm',
  flood:        'rain-heavy',
  cyclone:      'storm',
  heatwave:     'dust',
  blizzard:     'snow-heavy',
}

const DISASTER_OVERLAYS: Record<DisasterType, string> = {
  thunderstorm: 'radial-gradient(ellipse at 50% 0%, rgba(100,50,200,0.15), transparent 70%)',
  flood:        'linear-gradient(180deg, transparent 40%, rgba(30,80,180,0.2) 100%)',
  cyclone:      'radial-gradient(ellipse at 50% 50%, rgba(40,180,200,0.08), transparent 70%)',
  heatwave:     'radial-gradient(ellipse at 50% 0%, rgba(255,100,30,0.12), transparent 70%)',
  blizzard:     'linear-gradient(180deg, rgba(180,220,255,0.08), rgba(180,220,255,0.02))',
}

export function WeatherScene({ weather, unit, disasterMode, disasterType, loading }: WeatherSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { setMode } = useParticles(canvasRef)

  const cur   = weather?.current
  const isDay = cur?.is_day === 1
  const meta  = cur ? getWeatherMeta(cur.weather_code) : null
  const scene = cur ? getSceneForCode(cur.weather_code, isDay) : 'clear-night'
  const sc    = SCENE_COLORS[scene]

  /* Update particles */
  useEffect(() => {
    if (loading) { setMode('none'); return }
    if (disasterMode && disasterType) {
      setMode(DISASTER_PARTICLE_MODES[disasterType])
      return
    }
    if (!isDay && scene === 'clear-night') { setMode('stars'); return }
    setMode(meta?.particleMode ?? 'none')
  }, [loading, disasterMode, disasterType, meta, scene, isDay, setMode])

  /* Apply scene colors to CSS variables */
  useEffect(() => {
    const root = document.documentElement
    if (disasterMode && disasterType) {
      const dc = DISASTER_SCENE_COLORS[disasterType]
      root.style.setProperty('--scene-top', dc.top)
      root.style.setProperty('--scene-mid', dc.mid)
      root.style.setProperty('--scene-bot', dc.bot)
      root.style.setProperty('--scene-accent', 'rgba(255,80,80,0.08)')
    } else {
      root.style.setProperty('--scene-top',    sc.top)
      root.style.setProperty('--scene-mid',    sc.mid)
      root.style.setProperty('--scene-bot',    sc.bot)
      root.style.setProperty('--scene-accent', sc.accent)
    }
  }, [scene, sc, disasterMode, disasterType])

  const temp    = cur ? displayTemp(cur.temperature_2m, unit) : '--°'
  const feelStr = cur ? `Feels like ${displayTemp(cur.apparent_temperature, unit)}` : 'Detecting your location…'
  const condLabel = disasterMode && disasterType
    ? DISASTER_CONFIGS[disasterType].label
    : (meta?.label ?? 'Atmospheric Intelligence')
  const timeStr = formatTimeShort(new Date())
  const showClouds = sc.hasClouds || (disasterMode && disasterType !== 'heatwave')
  const showFog    = sc.hasFog

  return (
    <section
      className="scene-bg relative w-full overflow-hidden flex flex-col items-center justify-end"
      style={{ minHeight: '100svh', paddingBottom: 40, paddingTop: 72 }}
      aria-label="Current weather scene"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      />

      {/* Atmosphere ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 300, top: -100, left: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(80px)',
            background: 'var(--scene-accent)',
            animation: 'atmGlow 8s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Disaster overlay gradient */}
      {disasterMode && disasterType && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ background: DISASTER_OVERLAYS[disasterType], zIndex: 3, opacity: 1 }}
          aria-hidden="true"
        />
      )}

      {/* Cloud layers */}
      {showClouds && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
          {[
            { w: 280, h: 60, top: '22%', left: '-5%',  anim: 'cloudDrift1 60s linear infinite',  dark: scene.includes('rain') || scene === 'storm' || scene === 'overcast' },
            { w: 200, h: 45, top: '30%', right: '-5%', anim: 'cloudDrift2 80s linear infinite',  dark: scene.includes('rain') || scene === 'storm' },
            { w: 350, h: 70, top: '15%', left: '20%',  anim: 'cloudDrift3 100s linear infinite', dark: scene === 'overcast' || scene === 'storm' },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute rounded-[50px]"
              style={{
                width: c.w, height: c.h, top: c.top,
                left: 'left' in c ? c.left : undefined,
                right: 'right' in c ? c.right : undefined,
                background: c.dark
                  ? 'rgba(0,0,0,0.25)'
                  : 'rgba(255,255,255,0.07)',
                filter: 'blur(2px)',
                animation: c.anim,
              }}
            />
          ))}
        </div>
      )}

      {/* Fog layer */}
      {showFog && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            zIndex: 2,
            background: 'repeating-linear-gradient(0deg,rgba(150,170,200,0.03) 0px,rgba(150,170,200,0.03) 1px,transparent 1px,transparent 40px)',
          }}
        />
      )}

      {/* Sun */}
      {isDay && scene === 'clear' && !disasterMode && (
        <div
          className="absolute"
          style={{ top: '18%', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
          aria-hidden="true"
        >
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, #FFF5D6, #FBB22D 40%, #F59500)',
              boxShadow: '0 0 0 20px rgba(251,178,45,0.12),0 0 0 50px rgba(251,178,45,0.06),0 0 100px rgba(251,178,45,0.3)',
              animation: 'sunPulse 6s ease-in-out infinite',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute', inset: -30, borderRadius: '50%',
                background: 'conic-gradient(from 0deg,transparent 0%,rgba(251,178,45,0.06) 5%,transparent 10%,rgba(251,178,45,0.06) 15%,transparent 20%,rgba(251,178,45,0.06) 25%,transparent 30%,rgba(251,178,45,0.06) 35%,transparent 40%,rgba(251,178,45,0.06) 45%,transparent 50%,rgba(251,178,45,0.06) 55%,transparent 60%,rgba(251,178,45,0.06) 65%,transparent 70%,rgba(251,178,45,0.06) 75%,transparent 80%,rgba(251,178,45,0.06) 85%,transparent 90%,rgba(251,178,45,0.06) 95%,transparent 100%)',
                animation: 'sunRay 20s linear infinite',
              }}
            />
          </div>
        </div>
      )}

      {/* Moon */}
      {!isDay && scene === 'clear-night' && !disasterMode && (
        <div
          className="absolute"
          style={{ top: '15%', right: '22%', zIndex: 2 }}
          aria-hidden="true"
        >
          <div
            style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #F0E8D4, #D4C8A0)',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.08),0 0 40px rgba(220,200,150,0.15)',
              animation: 'moonGlow 8s ease-in-out infinite',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Moon crater shadow */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'radial-gradient(circle at 62% 55%, rgba(6,11,20,0.75) 0%, transparent 52%)' }} />
          </div>
        </div>
      )}

      {/* City silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1400 180"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        style={{ zIndex: 4, opacity: 0.55 }}
      >
        <path
          d="M0,180 L0,120 L30,120 L30,100 L50,100 L50,80 L70,80 L70,100 L90,100 L90,60 L100,60 L100,50 L120,50 L120,60 L140,60 L140,110 L170,110 L170,80 L190,80 L190,70 L210,70 L210,80 L240,80 L240,100 L270,100 L270,65 L300,65 L300,45 L310,35 L320,45 L320,65 L360,65 L360,100 L380,100 L380,80 L400,80 L400,70 L420,70 L420,80 L450,80 L450,110 L470,110 L470,75 L490,75 L490,60 L520,60 L520,75 L540,75 L540,110 L570,110 L570,85 L600,85 L600,65 L620,55 L640,65 L640,85 L670,85 L670,110 L700,110 L700,90 L730,90 L730,75 L750,75 L750,90 L780,90 L780,110 L810,110 L810,80 L830,80 L830,55 L850,55 L850,80 L880,80 L880,110 L910,110 L910,90 L940,90 L940,75 L960,75 L960,55 L970,45 L980,55 L980,75 L1010,75 L1010,90 L1040,90 L1040,110 L1070,110 L1070,85 L1100,85 L1100,65 L1120,55 L1130,45 L1140,55 L1140,65 L1170,65 L1170,85 L1200,85 L1200,110 L1230,110 L1230,90 L1260,90 L1260,110 L1290,110 L1290,100 L1310,100 L1310,120 L1340,120 L1340,110 L1370,110 L1370,120 L1400,120 L1400,180 Z"
          fill="rgba(0,0,0,0.35)"
        />
      </svg>

      {/* Main temperature display */}
      <div
        className="relative flex flex-col items-center gap-2 px-6 text-center"
        style={{ zIndex: 10 }}
      >
        {/* Disaster simulation badge */}
        {disasterMode && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-2"
            style={{
              background: 'rgba(255,91,122,0.12)',
              border: '1px solid rgba(255,91,122,0.3)',
              fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#FF8FA3', fontFamily: 'var(--font-dm-mono)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF5B7A',
              animation: 'blink 1.2s ease-in-out infinite', display: 'inline-block' }} />
            Simulation Active
          </div>
        )}

        <h1
          className="font-syne leading-none"
          style={{
            fontSize: 'clamp(72px, 16vw, 140px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(255,255,255,0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          aria-label={`Temperature: ${temp}`}
        >
          {loading ? '--°' : temp}
        </h1>

        <p
          className="font-outfit"
          style={{
            fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.62)', letterSpacing: '0.04em',
          }}
        >
          {loading ? 'Loading…' : condLabel}
        </p>

        <p
          className="font-mono"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginTop: 4 }}
        >
          {loading ? '' : feelStr}
        </p>

        {/* Live indicator */}
        <div
          className="flex items-center gap-2 mt-3"
          style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}
        >
          <span
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent-blue)',
              animation: 'blink 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          />
          <span>{timeStr}</span>
          {!loading && <span style={{ opacity: 0.6 }}>· Live</span>}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-5 left-1/2 flex flex-col items-center gap-2"
        style={{
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.28)',
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          animation: 'scrollBounce 2s ease-in-out infinite',
          zIndex: 10, pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div style={{
          width: 14, height: 14,
          borderRight: '1.5px solid rgba(255,255,255,0.28)',
          borderBottom: '1.5px solid rgba(255,255,255,0.28)',
          transform: 'rotate(45deg)',
        }} />
        <span>Details</span>
      </div>
    </section>
  )
}
