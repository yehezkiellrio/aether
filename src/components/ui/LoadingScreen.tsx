'use client'

interface LoadingScreenProps {
  visible: boolean
  status?:  string
}

export function LoadingScreen({ visible, status = 'Calibrating atmospheric sensors…' }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 transition-all duration-500"
      style={{
        zIndex: 9999,
        background: 'var(--bg-0)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
      }}
      aria-hidden={!visible}
      role="status"
      aria-label={status}
    >
      {/* Animated orb */}
      <div
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(77,168,255,0.4), transparent 60%), radial-gradient(circle at 65% 65%, rgba(155,122,255,0.3), transparent 60%)',
          border: '1px solid rgba(77,168,255,0.3)',
          position: 'relative',
          animation: 'orbPulse 2.4s ease-in-out infinite',
          boxShadow: '0 0 40px rgba(77,168,255,0.2), inset 0 0 20px rgba(77,168,255,0.1)',
        }}
      >
        {/* Spinner ring */}
        <div
          style={{
            position: 'absolute', inset: 10, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            borderTopColor: 'rgba(77,168,255,0.6)',
            animation: 'sunRay 1.6s linear infinite',
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <span
          className="font-syne text-[22px] font-bold tracking-[0.05em]"
          style={{ color: 'var(--text-1)' }}
        >
          AETHER
        </span>
        <span
          className="font-mono text-[11px] tracking-[0.2em] uppercase"
          style={{
            color: 'var(--text-3)',
            animation: 'blink 2.4s ease-in-out infinite',
          }}
        >
          {status}
        </span>
      </div>
    </div>
  )
}
