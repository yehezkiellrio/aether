import { cn } from '@/lib/utils/format'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
  animate?: 'fade' | 'slide' | false
  delay?: number
  as?: keyof JSX.IntrinsicElements
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }

export function GlassCard({
  children, className, padding = 'md',
  animate = false, delay = 0, as: Tag = 'div',
}: GlassCardProps) {
  const AnimClass = animate === 'fade' ? 'animate-fade-in'
    : animate === 'slide' ? 'animate-slide-up' : ''
  const DelayClass = delay ? `delay-${delay}` : ''

  return (
    <Tag className={cn('glass', paddingMap[padding], AnimClass, DelayClass, className)}>
      {children}
    </Tag>
  )
}

/* ─── Section Header ──────────────────────────────────────────────────────────*/
export function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <h2 className="font-syne text-[11px] font-semibold tracking-[0.15em] uppercase"
          style={{ color: 'var(--text-3)' }}>
        {label}
      </h2>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

/* ─── Metric Card ─────────────────────────────────────────────────────────────*/
interface MetricCardProps {
  icon: string
  iconBg?: string
  value: React.ReactNode
  label: string
  sub?: React.ReactNode
}

export function MetricCard({ icon, iconBg = 'rgba(255,255,255,0.06)', value, label, sub }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px]"
           style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="font-mono text-xl leading-none" style={{ color: 'var(--text-1)' }}>
        {value}
      </div>
      <div className="text-[11px] tracking-wide" style={{ color: 'var(--text-3)' }}>
        {label}
      </div>
      {sub && (
        <div className="text-[11px]" style={{ color: 'var(--text-2)' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

/* ─── Skeleton Block ──────────────────────────────────────────────────────────*/
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

/* ─── Icon Button ─────────────────────────────────────────────────────────────*/
interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: React.ReactNode
}

export function IconBtn({ label, children, className, ...props }: IconBtnProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'w-9 h-9 rounded-[10px] flex items-center justify-center',
        'border transition-all duration-200',
        'hover:text-[var(--text-1)]',
        className,
      )}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
      {...props}
    >
      {children}
    </button>
  )
}
