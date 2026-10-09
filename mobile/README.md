# IronPulse Mobile (React Native / Expo)

The native companion application for **IronPulse Gym Training Session Tracker & Nutrition Engine**.

---

## 📱 Features
- **Athletic Dark HUD**: Native layout with dark UI matching IronPulse Web.
- **Active Workout Tracker**: Real-time logging of exercises, muscle groups, weights, reps, and working sets.
- **Nutrition & Calorie Gauge**: Calorie budget calculation and macro breakdown (Protein, Carbs, Fats).
- **Cross-Platform Sync**: Communicates directly with the Express backend (`server.js`) on `/api/workouts` and `/api/nutrition`.
- **Offline Fallback**: Functions smoothly offline with optimistic updates.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start the Expo Development Server
```bash
npm start
```
or:
```bash
npx expo start
```

### 3. Run on Devices / Emulators
- **Physical Device**: Scan the terminal QR code using the **Expo Go** app (available on iOS App Store & Google Play).
- **iOS Simulator**: Press `i` in the terminal (macOS with Xcode).
- **Android Emulator**: Press `a` in the terminal (with Android Studio).
- **Web Preview**: Press `w` in the terminal.

---

## 🔌 Connecting to Local Backend (`server.js`)
Ensure the root server is running:
```bash
# In the repository root
npm start
```
By default:
- **Android Emulator**: Uses `http://10.0.2.2:3000` (maps to host localhost).
- **iOS Simulator**: Uses `http://localhost:3000`.
- **Physical Device**: Update `customApiUrl` in `src/services/api.ts` to your machine's LAN IP (e.g. `http://192.168.1.xxx:3000`).
