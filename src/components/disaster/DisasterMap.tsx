'use client'

import { useEffect, useRef } from 'react'
import type { DisasterType } from '@/types/weather'

/* ── Disaster overlay colours & styles ─────────────────────────────────────── */
const DISASTER_OVERLAYS: Record<DisasterType, {
  color: string
  fillOpacity: number
  pulseColor: string
  tileFilter: string   // CSS filter applied to the tile layer via JS hack
  label: string
}> = {
  thunderstorm: {
    color: '#9B7AFF',
    fillOpacity: 0.18,
    pulseColor: 'rgba(155,122,255,0.35)',
    tileFilter: 'hue-rotate(240deg) saturate(0.6) brightness(0.55)',
    label: '⛈️ Extreme Storm',
  },
  flood: {
    color: '#3ABEFF',
    fillOpacity: 0.22,
    pulseColor: 'rgba(58,190,255,0.35)',
    tileFilter: 'hue-rotate(180deg) saturate(0.8) brightness(0.5)',
    label: '🌊 Flood',
  },
  cyclone: {
    color: '#FF7043',
    fillOpacity: 0.2,
    pulseColor: 'rgba(255,112,67,0.35)',
    tileFilter: 'hue-rotate(10deg) saturate(0.7) brightness(0.5)',
    label: '🌀 Cyclone',
  },
  heatwave: {
    color: '#FFB300',
    fillOpacity: 0.2,
    pulseColor: 'rgba(255,179,0,0.3)',
    tileFilter: 'sepia(0.5) saturate(1.4) brightness(0.6)',
    label: '🔥 Heatwave',
  },
  blizzard: {
    color: '#B0C4DE',
    fillOpacity: 0.25,
    pulseColor: 'rgba(176,196,222,0.4)',
    tileFilter: 'saturate(0.15) brightness(0.65) contrast(0.9)',
    label: '❄️ Blizzard',
  },
}

interface DisasterMapProps {
  lat: number
  lon: number
  cityName: string
  disasterType: DisasterType
}

export function DisasterMap({ lat, lon, cityName, disasterType }: DisasterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const layersRef    = useRef<any[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Dynamically import leaflet (SSR-safe)
    import('leaflet').then(L => {
      // Fix default marker icon paths broken by webpack
      // @ts-ignore
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const Leaflet = L.default

      // Destroy old map instance if re-rendering
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        layersRef.current = []
      }

      // Init map
      const map = Leaflet.map(containerRef.current!, {
        center:          [lat, lon],
        zoom:            9,
        zoomControl:     true,
        attributionControl: true,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      // ── Tile layer (OpenStreetMap dark-ish Carto) ────────────────────────
      const tileLayer = Leaflet.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      // Apply CSS filter to darken/tint the map tiles based on disaster type
      const cfg = DISASTER_OVERLAYS[disasterType]
      const pane = map.getPane('tilePane')
      if (pane) {
        pane.style.filter = cfg.tileFilter
      }

      // ── Disaster radius overlay (circle) ────────────────────────────────
      const radiusKm = 120_000 // 120 km affected radius
      const circle = Leaflet.circle([lat, lon], {
        radius:      radiusKm,
        color:       cfg.color,
        fillColor:   cfg.color,
        fillOpacity: cfg.fillOpacity,
        weight:      1.5,
        dashArray:   '6 4',
        opacity:     0.7,
      }).addTo(map)
      layersRef.current.push(circle)

      // ── Inner hot-zone circle ────────────────────────────────────────────
      const innerCircle = Leaflet.circle([lat, lon], {
        radius:      40_000,
        color:       cfg.color,
        fillColor:   cfg.color,
        fillOpacity: cfg.fillOpacity + 0.12,
        weight:      0,
      }).addTo(map)
      layersRef.current.push(innerCircle)

      // ── Epicentre marker ─────────────────────────────────────────────────
      const epicentreIcon = Leaflet.divIcon({
        className: '',
        html: `
          <div style="
            position:relative;
            width:20px; height:20px;
          ">
            <div style="
              position:absolute; inset:0;
              border-radius:50%;
              background:${cfg.color};
              opacity:0.9;
              animation: pulse-ring 2s ease-out infinite;
            "></div>
            <div style="
              position:absolute; inset:4px;
              border-radius:50%;
              background:white;
            "></div>
          </div>
        `,
        iconSize:   [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = Leaflet.marker([lat, lon], { icon: epicentreIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:monospace;font-size:12px;color:#111">
            <strong>${cfg.label}</strong><br/>
            📍 ${cityName}<br/>
            🌐 ${lat.toFixed(3)}, ${lon.toFixed(3)}
          </div>`,
          { offset: [0, -10] }
        )
        .openPopup()
      layersRef.current.push(marker)

      // Inject pulse animation CSS once
      if (!document.getElementById('leaflet-pulse-style')) {
        const style = document.createElement('style')
        style.id = 'leaflet-pulse-style'
        style.textContent = `
          @keyframes pulse-ring {
            0%   { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        `
        document.head.appendChild(style)
      }

      // Fit map to show full radius
      map.fitBounds(circle.getBounds(), { padding: [20, 20] })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // Re-render whenever location or disaster type changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, disasterType])

  return (
    <>
      {/* Inject Leaflet CSS via link tag */}
      {typeof window !== 'undefined' && !document.getElementById('leaflet-css') && (() => {
        const link = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
        return null
      })()}

      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
        {/* Label badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1000,
          background: 'rgba(0,0,0,0.65)',
          border: `1px solid ${DISASTER_OVERLAYS[disasterType].color}60`,
          color: DISASTER_OVERLAYS[disasterType].color,
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: 11,
          fontFamily: 'monospace',
          letterSpacing: '0.08em',
          backdropFilter: 'blur(6px)',
          pointerEvents: 'none',
        }}>
          LIVE MAP · {cityName.toUpperCase()}
        </div>

        {/* Map container */}
        <div
          ref={containerRef}
          style={{ width: '100%', height: 240 }}
        />
      </div>
    </>
  )
}
