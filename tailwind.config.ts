import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: {
          0: '#060B14',
          1: '#0D1525',
          2: '#111D2E',
        },
        surface: {
          1: 'rgba(255,255,255,0.035)',
          2: 'rgba(255,255,255,0.055)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.075)',
          strong: 'rgba(255,255,255,0.13)',
        },
        text: {
          1: '#E8F0FE',
          2: '#8A9AB8',
          3: '#4A5B74',
        },
        accent: {
          blue: '#4DA8FF',
          amber: '#FBB22D',
          danger: '#FF5B7A',
          storm: '#9B7AFF',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
      animation: {
        'orb-pulse': 'orbPulse 2.4s ease-in-out infinite',
        'sun-pulse': 'sunPulse 6s ease-in-out infinite',
        'sun-ray': 'sunRay 20s linear infinite',
        'moon-glow': 'moonGlow 8s ease-in-out infinite',
        'cloud-drift-1': 'cloudDrift1 60s linear infinite',
        'cloud-drift-2': 'cloudDrift2 80s linear infinite',
        'cloud-drift-3': 'cloudDrift3 100s linear infinite',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        blink: 'blink 2s ease-in-out infinite',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'skeleton-pulse': 'skeletonPulse 1.6s ease-in-out infinite',
      },
      keyframes: {
        orbPulse: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        sunPulse: {
          '0%,100%': { boxShadow: '0 0 0 20px rgba(251,178,45,0.12),0 0 0 50px rgba(251,178,45,0.06),0 0 100px rgba(251,178,45,0.3)' },
          '50%': { boxShadow: '0 0 0 28px rgba(251,178,45,0.08),0 0 0 70px rgba(251,178,45,0.03),0 0 120px rgba(251,178,45,0.25)' },
        },
        sunRay: { to: { transform: 'rotate(360deg)' } },
        moonGlow: {
          '0%,100%': { boxShadow: '0 0 0 2px rgba(255,255,255,0.08),0 0 40px rgba(220,200,150,0.15)' },
          '50%': { boxShadow: '0 0 0 2px rgba(255,255,255,0.12),0 0 60px rgba(220,200,150,0.2)' },
        },
        cloudDrift1: { from: { transform: 'translateX(-30%)' }, to: { transform: 'translateX(110%)' } },
        cloudDrift2: { from: { transform: 'translateX(110%)' }, to: { transform: 'translateX(-30%)' } },
        cloudDrift3: { from: { transform: 'translateX(-10%)' }, to: { transform: 'translateX(30%)' } },
        fadeIn: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        blink: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        scrollBounce: { '0%,100%': { transform: 'translateX(-50%) translateY(0)' }, '50%': { transform: 'translateX(-50%) translateY(6px)' } },
        skeletonPulse: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        atmGlow: {
          '0%': { opacity: '0.6', transform: 'translateX(-50%) scaleX(1)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) scaleX(1.2)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
