'use client'

interface OnboardingProps {
  onGeo:  () => void
  onSkip: () => void
}

export function Onboarding({ onGeo, onSkip }: OnboardingProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 300,
          background: 'rgba(4,8,16,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-label="Welcome to Aether"
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{ zIndex: 301 }}
      >
        <div
          className="w-full max-w-[400px] flex flex-col items-center gap-5 text-center p-9 animate-spring"
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border-strong)',
            borderRadius: 28,
            boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
          }}
        >
          {/* Orb */}
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(77,168,255,0.5), rgba(155,122,255,0.3))',
              border: '1px solid rgba(77,168,255,0.3)',
              boxShadow: '0 0 40px rgba(77,168,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}
          >
            ⛅
          </div>

          <div>
            <h1 className="font-syne text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
              Welcome to Aether
            </h1>
            <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--text-2)' }}>
              Premium atmospheric intelligence for every condition. Allow location access for real-time local
              weather, or search any city worldwide.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Real-time forecast', 'Animated scenes', 'Disaster simulation'].map(f => (
              <span
                key={f}
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                  letterSpacing: '0.04em',
                }}
              >
                {f}
              </span>
            ))}
          </div>

          <button
            onClick={onGeo}
            className="w-full py-3.5 rounded-[14px] text-[15px] font-semibold text-white
                       transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #4DA8FF, #9B7AFF)' }}
          >
            Use My Location
          </button>

          <button
            onClick={onSkip}
            className="text-[12px] underline underline-offset-4 transition-colors"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-2)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            Search for a city instead
          </button>
        </div>
      </div>
    </>
  )
}
