# IronPulse — Modern Gym Training Session Tracker

A modern, high-performance **Gym Training Session Tracker** built with **React 18**, **TypeScript**, **Material UI (MUI v6)**, **React Router**, **Express**, **Jest**, and **Playwright**.

---

## ⚡ Features

- **Modern Athletic Design**: Obsidian slate dark mode and clean titanium chalk light mode with athletic emerald and cyan accents. Strictly zero raw inline styles, utilizing centralized Emotion styled components and design tokens.
- **Session Volume & Completion Meter**: Real-time workout progress tracking across intensity phases (`Warmup & Mobility`, `Initiating Volume`, `In The Zone`, `High Output`, `Peak Intensity`, `Session Crushed! 🔥`).
- **Quick Exercise Logger**: Rapidly log exercises with target muscle group (`Chest`, `Back`, `Legs`, `Shoulders`, `Arms`, `Core`, `Cardio`), intensity levels (`Warmup`, `Moderate`, `Max Effort`), and target sets.
- **Interactive Workout List**: Mark completed movements with glowing checkmarks, edit exercise titles inline via double-click, and delete or re-order.
- **Session Filter Toolbar**: Filter workouts by `ALL`, `PLANNED`, and `FINISHED`, with quick bulk-clear for finished exercises.
- **Session Completion Confetti**: Canvas-driven victory celebration when crushing all planned exercises.
- **Multi-Page Routing**:
  - `/` (Home): Primary active workout session tracker and exercise logger.
  - `/history`: Completed session logs and historical volume archives.
  - `/exercises`: Movement library with one-click "Add to Session" shortcuts.
  - `/analytics`: Volume metrics, completion percentages, and muscle group split breakdowns.
  - `/settings`: Preferences for weight units (`kg` vs `lbs`), rest timers, and themes.

---

## 🧪 Testing Suite

### TypeScript Type Checking
```powershell
npx tsc --noEmit
```

### Unit & Component Tests (Jest)
Run unit tests with React Testing Library:
```powershell
npm test
```
- Tests `WorkoutMeter` progress and intensity rank calculations.
- Tests `WorkoutInput` validation and submission events.
- Tests `WorkoutItem` checkbox toggling, deletion, and inline editing.

### End-to-End Tests (Playwright)
Run automated browser tests:
```powershell
npm run test:e2e
```
- Tests page loading and athletic branding.
- Tests logging new exercises with muscle groups.
- Tests toggling completion and updating the volume meter.
- Tests filter tabs and bulk clearing.
- Tests navigation between page routes (`/`, `/exercises`, `/history`, `/analytics`).
- Tests dark/light theme switching.

---

## 🚀 Getting Started

### Development
```powershell
# Start Express backend
npm run dev:server

# Start Vite frontend
npm run dev
```

### Production Build
```powershell
npm run build
npm start
```

Visit the app at **http://localhost:3000** (or **http://localhost:5173** during Vite dev).
