interface StateCardProps {
  icon:    string
  title:   string
  desc:    string
  action?: { label: string; onClick: () => void }
}

export function StateCard({ icon, title, desc, action }: StateCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 text-center p-12 animate-fade-in"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 28,
      }}
    >
      <span style={{ fontSize: 40, filter: 'grayscale(0.3)' }} aria-hidden="true">{icon}</span>
      <div>
        <h2 className="font-syne text-[18px] font-semibold mb-2" style={{ color: 'var(--text-1)' }}>
          {title}
        </h2>
        <p className="text-[14px] leading-relaxed max-w-sm" style={{ color: 'var(--text-2)' }}>
          {desc}
        </p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-200"
          style={{
            background: 'rgba(77,168,255,0.12)',
            border: '1px solid rgba(77,168,255,0.3)',
            color: '#4DA8FF',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,168,255,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(77,168,255,0.12)')}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export function PermissionDeniedCard({ onSearch }: { onSearch: () => void }) {
  return (
    <StateCard
      icon="🔒"
      title="Location Access Denied"
      desc="Aether needs location permission to show your local weather. You can also search for any city manually."
      action={{ label: 'Search a Location', onClick: onSearch }}
    />
  )
}

export function OfflineCard() {
  return (
    <StateCard
      icon="📡"
      title="You're Offline"
      desc="No network connection detected. Showing the most recently cached weather data. Aether will automatically refresh when you reconnect."
    />
  )
}

export function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <StateCard
      icon="⚠️"
      title="Weather Data Unavailable"
      desc="Could not reach the weather API. Displaying demonstration data. Check your connection or try refreshing."
      action={{ label: 'Try Again', onClick: onRetry }}
    />
  )
}

/* ─── Skeleton Dashboard ────────────────────────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Quick stats */}
      <div style={{
        borderRadius: 20, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1,
        background: 'var(--border)', border: '1px solid var(--border)',
      }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ background: 'var(--surface-1)', padding: '20px 12px' }}>
            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 10, width: '50%' }} />
          </div>
        ))}
      </div>
      {/* Metrics */}
      <div>
        <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton" style={{ height: 96, borderRadius: 14 }} />
          ))}
        </div>
      </div>
      {/* Forecast */}
      <div className="skeleton" style={{ height: 220, borderRadius: 20 }} />
      <div className="skeleton" style={{ height: 320, borderRadius: 20 }} />
    </div>
  )
}
