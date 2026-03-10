'use client'

import type { AppState } from '@/types/weather'
import { QuickStats }     from '@/components/weather/QuickStats'
import { MetricsGrid }    from '@/components/weather/MetricsGrid'
import { SunMoonCard }    from '@/components/weather/SunMoonCard'
import { HourlyForecast } from '@/components/weather/HourlyForecast'
import { DailyForecast }  from '@/components/weather/DailyForecast'
import { AirQualityCard } from '@/components/weather/AirQualityCard'
import { DisasterPanel }  from '@/components/disaster/DisasterPanel'
import {
  DashboardSkeleton,
  PermissionDeniedCard,
  OfflineCard,
  ErrorCard,
} from '@/components/ui/StateCards'
import type { DisasterType } from '@/types/weather'

interface DashboardProps {
  state:            AppState
  onSearch:         () => void
  onToggleDisaster: () => void
  onDisasterType:   (t: DisasterType) => void
  onRetry:          () => void
}

export function Dashboard({ state, onSearch, onToggleDisaster, onDisasterType, onRetry }: DashboardProps) {
  const { weather, loading, error, permissionDenied, isOffline, unit, disasterMode, disasterType, useMockData } = state

  return (
    <section
      id="dashboard"
      style={{
        background: 'var(--bg-0)',
        padding: '24px 16px 60px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Offline banner */}
        {isOffline && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] animate-fade-in"
            style={{
              background: 'rgba(251,178,45,0.08)',
              border: '1px solid rgba(251,178,45,0.2)',
              color: '#FBB22D',
            }}
          >
            <span>📡</span> You're offline. Showing cached data.
          </div>
        )}

        {/* Mock data banner */}
        {useMockData && !loading && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] animate-fade-in"
            style={{
              background: 'rgba(155,122,255,0.08)',
              border: '1px solid rgba(155,122,255,0.2)',
              color: '#B99FFF',
            }}
          >
            <span>🔮</span> Showing demonstration data — API unavailable or no location set.
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <DashboardSkeleton />}

        {/* Permission denied */}
        {!loading && permissionDenied && !weather && (
          <PermissionDeniedCard onSearch={onSearch} />
        )}

        {/* Offline, no data */}
        {!loading && isOffline && !weather && (
          <OfflineCard />
        )}

        {/* Weather content */}
        {!loading && weather && (
          <>
            <QuickStats current={weather.current} />

            <MetricsGrid current={weather.current} daily={weather.daily} unit={unit} />

            <SunMoonCard daily={weather.daily} />

            <HourlyForecast hourly={weather.hourly} current={weather.current} unit={unit} />

            <DailyForecast daily={weather.daily} unit={unit} />

            <AirQualityCard aqi={null} />

            <DisasterPanel
              active={disasterMode}
              type={disasterType}
              onToggle={onToggleDisaster}
              onTypeSelect={onDisasterType}
            />
          </>
        )}

        {/* API Error with data fallback */}
        {!loading && error && weather && (
          <ErrorCard onRetry={onRetry} />
        )}
      </div>
    </section>
  )
}
