# AETHER — Atmospheric Intelligence

> Premium real-time weather visualization with immersive animated scenes, disaster simulation, and enterprise-grade UX.

![Aether Weather App](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Features

### Weather Dashboard
- **Real-time conditions** — temperature, feels like, humidity, wind, pressure, UV index, visibility, cloud cover
- **Hourly forecast** — 24-hour scrollable with animated canvas chart
- **7-day forecast** — temperature range bars with precipitation probability
- **Sun & Moon** — sunrise/sunset with live daylight progress indicator
- **Air Quality** — AQI display with pollutant breakdown

### Animated Weather Scene
- Dynamic sky that changes with weather code, time of day, and intensity
- Particle system: rain (light/heavy), snow, storms with lightning, dust/fog, stars
- Animated clouds, sun with rays, moon with craters
- City silhouette with depth
- All particles canvas-rendered at 60fps

### Location Features
- Browser geolocation with graceful fallback
- City search via Open-Meteo Geocoding API (free, no key)
- Reverse geocoding via Nominatim
- Recent locations (persisted in localStorage)
- ⌘K / Ctrl+K quick search shortcut

### Disaster Simulation Mode
Educational disaster visualization with 5 scenario types:
- **Extreme Storm** — Category 5 thunderstorm with lightning particle effects
- **Flood Warning** — Heavy rain visualization with impact analysis
- **Cyclone Track** — Rotating radar simulation with storm surge info
- **Extreme Heat** — Heatwave atmospheric distortion effects
- **Blizzard** — Dense snow particle system with wind chill data

Each simulation includes: severity rating, simulated parameters, impact list, radar placeholder.

### UX States
- ✅ Premium loading screen with animated orb
- ✅ Skeleton loading
- ✅ Onboarding modal on first visit
- ✅ Permission denied state
- ✅ Offline detection with cached data
- ✅ API error fallback to realistic mock data
- ✅ Toast notifications

### Accessibility
- Semantic HTML with ARIA labels
- Keyboard navigable (Tab, ⌘K, Escape)
- Focus-visible states
- Reduced motion support via `prefers-reduced-motion`
- Color contrast compliant

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/aether-weather
cd aether-weather

# Install dependencies
npm install

# Copy environment file (no keys required for basic usage)
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The app works fully without any API keys. It uses [Open-Meteo](https://open-meteo.com/) which is completely free with no authentication required.

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Google Fonts
│   ├── page.tsx            # Main application page (client component)
│   └── globals.css         # Design system CSS variables + keyframes
│
├── components/
│   ├── weather/
│   │   ├── WeatherScene.tsx     # Animated atmospheric hero section
│   │   ├── QuickStats.tsx       # Top 4-column metrics bar
│   │   ├── MetricsGrid.tsx      # 8-card detailed conditions grid
│   │   ├── HourlyForecast.tsx   # Canvas chart + scrollable hour cards
│   │   ├── DailyForecast.tsx    # 7-day forecast list
│   │   ├── SunMoonCard.tsx      # Sunrise/sunset with progress bar
│   │   └── AirQualityCard.tsx   # AQI display
│   │
│   ├── disaster/
│   │   └── DisasterPanel.tsx    # Simulation mode panel + radar
│   │
│   ├── location/
│   │   └── SearchModal.tsx      # Debounced search modal with recent locs
│   │
│   ├── layout/
│   │   ├── Header.tsx           # Fixed navigation bar
│   │   ├── Onboarding.tsx       # First-run welcome modal
│   │   └── Dashboard.tsx        # Dashboard layout + state routing
│   │
│   └── ui/
│       ├── GlassCard.tsx        # Glass card + MetricCard + SectionHeader
│       ├── LoadingScreen.tsx    # Animated loading overlay
│       ├── Toast.tsx            # Toast notification + hook
│       └── StateCards.tsx       # Error/Permission/Offline/Skeleton states
│
├── hooks/
│   ├── useWeather.ts        # Main state management hook
│   └── useParticles.ts      # Canvas particle system hook
│
├── lib/
│   ├── api/
│   │   └── weather.ts       # API calls (Open-Meteo, Nominatim)
│   ├── mock/
│   │   └── mockData.ts      # Realistic demo data (London)
│   └── utils/
│       └── format.ts        # Formatting utilities
│
├── types/
│   └── weather.ts           # TypeScript interfaces
│
└── constants/
    └── weather.ts           # WMO codes, scene configs, disaster configs
```

---

## 📡 Data Flow

```
User opens app
  │
  ├─ First visit → Onboarding → [Geo permission] or [Search]
  │
  ├─ Returning → Load recent location automatically
  │
  └─ Location acquired
        │
        ├─ fetchWeather(lat, lon) → Open-Meteo API
        │         └─ On failure → MOCK_WEATHER (demo mode)
        │
        ├─ reverseGeocode(lat, lon) → Nominatim API
        │
        └─ State updated → Components re-render
              ├─ WeatherScene → updateSceneColors + setParticleMode
              ├─ Dashboard → all weather cards
              └─ Header → location name
```

---

## 🌐 APIs Used

| API | Purpose | Auth Required |
|-----|---------|---------------|
| [Open-Meteo](https://open-meteo.com/) | Weather forecast | ❌ Free, no key |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search | ❌ Free, no key |
| [Nominatim](https://nominatim.openstreetmap.org/) | Reverse geocoding | ❌ Free, no key |
| Browser Geolocation API | User coordinates | User permission |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Netlify

```bash
npm run build
# Deploy the .next folder via Netlify CLI or UI
```

### Docker

```bash
# Uncomment output: 'standalone' in next.config.js first
docker build -t aether-weather .
docker run -p 3000:3000 aether-weather
```

### Environment Variables

Copy `.env.example` to `.env.local`. All variables are optional — the app works without any:

```env
# Optional: OpenWeatherMap for enhanced air quality data
NEXT_PUBLIC_OWM_KEY=your_key_here

# Optional: Mapbox for map/radar features  
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

---

## 🎨 Design System

### Typography
- **Syne** — Display / headings (800 weight for temperatures)
- **Outfit** — Body / UI text (clean, modern sans-serif)
- **DM Mono** — Data / numbers (monospaced for values)

### Color System (Dark mode default)
```
bg-0:          #060B14  — deepest background
bg-1:          #0D1525  — card backgrounds
surface-1:     rgba(255,255,255,0.035) — glass surfaces
accent-blue:   #4DA8FF
accent-amber:  #FBB22D
accent-storm:  #9B7AFF
accent-danger: #FF5B7A
```

### Scene Colors
Each weather condition (clear, rain, storm, snow, fog, etc.) has its own sky gradient and cloud/fog/sun/moon visibility settings.

---

## 🔧 Development Notes

### Adding New Weather Conditions
1. Add the WMO code mapping in `src/constants/weather.ts` → `WEATHER_CODES`
2. Add a scene key in `SCENE_COLORS` if needed
3. The particle system automatically handles the mode via `particleMode` field

### Adding New Disaster Types
1. Add config in `DISASTER_CONFIGS` in `src/constants/weather.ts`
2. Add the type to `DisasterType` union in `src/types/weather.ts`
3. Add scene colors in `DISASTER_SCENE_COLORS` in `WeatherScene.tsx`

### Performance Notes
- Particle canvas uses `requestAnimationFrame` and auto-cancels on unmount
- Weather data is cached by Next.js `revalidate` (10 minutes)
- Components use `useCallback` / `useRef` to avoid unnecessary re-renders
- `ResizeObserver` handles canvas resizing cleanly

### Planned Enhancements
- [ ] Real air quality from OpenWeatherMap or IQAir API
- [ ] Mapbox mini radar map
- [ ] Share/screenshot card export
- [ ] Push notifications for weather alerts
- [ ] Multiple saved locations toggle
- [ ] Wind speed in mph/knots toggle
- [ ] Precipitation in inches toggle
- [ ] Pressure history sparkline

---

## 📝 License

MIT — feel free to use, modify, and deploy.

---

*Built with Next.js 14, TypeScript, Tailwind CSS, and Open-Meteo.*
