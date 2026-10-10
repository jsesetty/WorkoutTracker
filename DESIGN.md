# IronPulse Design System Specification (`DESIGN.md`)

> **Scope**: Authoritative design language, token catalog, and styling architecture for the IronPulse ecosystem across Web (`apps/web`) and Mobile (`apps/mobile`).  
> **Status**: Mandatory & Active. All UI components, page layouts, modals, and design modifications must strictly comply with this document.

---

## 1. Design Philosophy & Aesthetic Identity

IronPulse combines **Cyber-Athletic Minimalism** with a **Studio Performance Cockpit**. The visual language is inspired by high-end performance gym equipment, telemetry HUD interfaces, and modern studio fitness consoles.

### Core Visual Principles
1. **Dark-First Cockpit Atmosphere**: Deep void backgrounds (`#111317` Web / `#0A0D14` Mobile) eliminate visual fatigue and accentuate high-contrast biometric metrics.
2. **Kinetic Performance Accents**: Vivid accents (Studio Emerald `#10B981` on Web, Athletic Neon Amber `#FF5722` on Mobile, and Cyber Cyan `#00E5FF`) immediately direct user attention to critical telemetry.
3. **Data-Dense Telemetry Typography**: Strict separation between human-readable editorial text (`Plus Jakarta Sans`), high-impact brand headers (`Syne`), and monospace metric telemetry (`Space Grotesk`).
4. **Border-Driven Tactile Geometry**: Clean 1px translucent borders (`rgba(255, 255, 255, 0.08)`) and controlled corner radii replace heavy, skeuomorphic drop shadows.
5. **Living Interfaces**: Subtle micro-animations (`laserScan`, `pulseGlow`, smooth `0.15s` transitions) provide continuous feedback during workout logging and nutritional scanning.

---

## 2. Color System & Token Catalog

### 2.1 Primary Brand & Kinetic Accents
| Token | Hex / Value | Platform Usage | Intended Application |
| :--- | :--- | :--- | :--- |
| `primary.main` (Web) | `#10B981` | Web (MUI / Emotion) | Studio Emerald: Primary buttons, active tabs, completed sets, success badges |
| `primary.light` (Web) | `#34D399` | Web | Hover glows, progress bar highlights |
| `primary.dark` (Web) | `#059669` | Web | Button active/pressed states |
| `secondary.main` (Web) | `#64748B` | Web | Titanium Slate: Secondary actions, muted chips, column headers |
| `primary` (Mobile) | `#FF5722` | Mobile (RN Theme) | Athletic Neon Amber: Primary mobile CTAs, hero badges, workout triggers |
| `primaryGlow` (Mobile) | `rgba(255, 87, 34, 0.25)` | Mobile | Hero button shadows, active glow indicators |
| `secondary` (Mobile) | `#00E5FF` | Mobile | Cyber Cyan: Secondary actions, navigation highlights |
| `success` (Mobile) | `#00E676` | Mobile | Electric Emerald: Verified checkmarks, completed workout indicators |

### 2.2 Surface & Elevation Palette

#### Dark Mode (Default Cockpit)
| Layer | Web Token | Mobile Token | Description |
| :--- | :--- | :--- | :--- |
| **Root Void** | `#111317` | `#0A0D14` | Viewport backdrop, body background |
| **Surface Paper** | `#181B20` | `#121622` | Cards, list items, modal surfaces, headers |
| **Elevated Surface** | `rgba(255, 255, 255, 0.04)` | `#1A2030` | Hover states, nested pods, stepper containers |
| **Subtle Divider** | `rgba(255, 255, 255, 0.08)` | `rgba(255, 255, 255, 0.08)` | Card borders, table dividers, separator lines |
| **Active/Hover Border** | `rgba(255, 255, 255, 0.20)` | `rgba(255, 255, 255, 0.16)` | Card hover boundaries, active input borders |

#### Light Mode (Studio Alabaster)
| Layer | Web Token | Description |
| :--- | :--- | :--- |
| **Root Background** | `#FAFAFA` | Clean studio ambient backdrop |
| **Paper Surface** | `#FFFFFF` | Card paper, elevated panels, modal backgrounds |
| **Dividers & Borders** | `#E5E7EB` | Hairline border lines |
| **Muted Hover Surface** | `rgba(0, 0, 0, 0.02)` | Table row hovers, stepper backdrops |

### 2.3 Text & Contrast Hierarchy
| Level | Dark Mode Token | Light Mode Token | Typical Usage |
| :--- | :--- | :--- | :--- |
| **Text Primary** | `#F3F4F6` / `#F0F4F8` | `#111827` | Headings, card titles, numeric readout values |
| **Text Secondary** | `#9CA3AF` / `#8E9CAE` | `#6B7280` | Subtitles, helper text, inactive navigation items |
| **Text Muted** | `#6B7280` / `#556272` | `#9CA3AF` | Timestamp stamps, column headers, placeholder text |

### 2.4 Macro Engine Nutrition Palette (Universal Cross-Platform)
Both Web and Mobile strictly share identical color tokens for nutritional macronutrient tracking:

| Macronutrient | Color Token | Hex Code | Visual Character |
| :--- | :--- | :--- | :--- |
| **Protein** | `colors.protein` | `#FF5722` | High-energy Athletic Coral / Amber |
| **Carbohydrates** | `colors.carbs` | `#00E5FF` | Fast-glycogen Cyber Cyan |
| **Fats** | `colors.fats` | `#FFD600` | Dense-energy Gold / Amber |
| **Clean / Deficit** | `colors.success` | `#10B981` | Studio Emerald (caloric balance / wholesome status) |

### 2.5 Food Additive Hazard Classification Palette
Used in barcode scanning and nutrition ingredient risk badges:

| Risk Tier | Color Token | Hex Code | Border / BG Fill Pattern |
| :--- | :--- | :--- | :--- |
| **None (Clean)** | Emerald | `#10B981` | `border: 1px solid #10B98150; bg: #10B98112` |
| **Low Risk** | Cyan | `#06B6D4` | `border: 1px solid #06B6D450; bg: #06B6D412` |
| **Moderate Risk**| Amber | `#F59E0B` | `border: 1px solid #F59E0B50; bg: #F59E0B12` |
| **Hazardous** | Crimson | `#EF4444` | `border: 1px solid #EF444450; bg: #EF444412` |

---

## 3. Typography Architecture

IronPulse uses a three-tier typographic system loaded via Google Fonts and defined in CSS custom properties and theme definitions:

```css
:root {
  --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-brand: 'Syne', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-data: 'Space Grotesk', 'JetBrains Mono', Consolas, monospace;
}
```

### 3.1 Type Hierarchy Table
| Style Tier | Font Family | Weights | Letter Spacing | Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Display H1–H4** | `'Plus Jakarta Sans'` | `700`, `800` | `-0.02em` to `-0.015em` | Page titles, primary modal headers, dashboard greeting |
| **Display H5–H6** | `'Plus Jakarta Sans'` | `600`, `700` | `-0.01em` | Section headers, card titles, exercise names |
| **Brand Hero** | `'Syne'` | `800` | `0` | `IRONPULSE` logo mark, splash headlines |
| **Body Primary** | `'Plus Jakarta Sans'` | `400`, `500` | `0` | Dialog messages, instructions, descriptions |
| **Telemetry / Data** | `'Space Grotesk'` | `600`, `700` | `+0.02em` to `+0.05em` | Rep counters, weight inputs, timestamps, timers, macro numbers |
| **Buttons & Tabs** | `'Space Grotesk'` | `600` | `+0.03em` | Primary & secondary buttons, tab labels, action triggers |
| **Chips & Tags** | `'Space Grotesk'` | `600`, `700` | `+0.04em` | Set index tags, hazard badges, muscle group pills |

---

## 4. Spatial Geometry, Spacing & Elevation

### 4.1 Spacing Scale (8pt Grid)
All padding, margin, and gap values must strictly derive from the spacing grid:

| Token | Pixels | Rem (16px base) | Example Application |
| :--- | :--- | :--- | :--- |
| `xs` | `4px` | `0.25rem` | Badge padding, micro button gaps, steppers |
| `sm` | `8px` | `0.5rem` | Chip padding, list item row gaps, button vertical padding |
| `md` | `16px` | `1.0rem` | Card interior padding, toolbar gaps, form input spacing |
| `lg` | `24px` | `1.5rem` | Container padding, modal body padding, grid gutters |
| `xl` | `32px` | `2.0rem` | Screen padding, major section separators |
| `2xl` | `48px` | `3.0rem` | Viewport top/bottom page gutters (`AppShell`) |

### 4.2 Border Radius Hierarchy
| Tier | Value | Web Pattern | Mobile Pattern | Typical Elements |
| :--- | :--- | :--- | :--- | :--- |
| **Micro** | `4px` - `6px` | `borderRadius: '6px'` | `theme.borderRadius.sm` | Stepper buttons, chips, table row containers |
| **Input & Button**| `8px` - `10px` | `borderRadius: '8px'` | `theme.borderRadius.md` | Form fields, primary buttons, workout cards |
| **Card & Modal** | `12px` | `borderRadius: '12px'` | `theme.borderRadius.md` | Meter cards, dialogs, food inspector cards |
| **Elevated Hero** | `16px` - `18px` | `borderRadius: '16px'` | `theme.borderRadius.lg` | Mobile hero HUD cards, scanner viewfinder |
| **Pill / Circular**| `9999px` / `50%` | `borderRadius: '9999px'` | `theme.borderRadius.full` | Avatar button, macro progress bars, status dots |

### 4.3 Elevation & Shadows
IronPulse uses minimal blur elevation, prioritizing crisp border reticles in dark mode:

```ts
// Web Card Default Elevation
boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)'

// Floating Popover / Dropdown Menu
boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'

// Scanner HUD Glow
boxShadow: '0 0 12px rgba(16, 185, 129, 0.3), inset 0 0 12px rgba(16, 185, 129, 0.15)'
```

---

## 5. Kinetic Motion & Micro-Interactions

### 5.1 Keyframe Animations
Defined globally in `apps/web/src/index.css`:

1. **`laserScan`**:
   - Used for barcode viewfinder laser sweeping.
   - Cycle: `2.4s infinite ease-in-out`.
   - Motion: Travels vertically from `top: 8%` to `top: 88%` with opacity modulation (`0.7` to `1.0`).

2. **`pulseGlow`**:
   - Used for optical scanner borders and live HUD metrics.
   - Cycle: `2.5s infinite ease-in-out`.
   - Transition: Oscillates box shadow between subtle (`12px` spread, `0.3` alpha) and bright (`24px` spread, `0.6` alpha).

### 5.2 Transition Timings
- **Button & Tab Hovers**: `all 0.15s ease-in-out`
- **Theme Color Mode Switches**: `background-color 0.2s ease, color 0.2s ease`
- **Card Hover Border Highlights**: `border-color 0.15s ease, box-shadow 0.15s ease`

---

## 6. Implementation Recipes & Component Conventions

### 6.1 Web: Emotion Styled Component Pattern
All web components must use Emotion's `styled` utility exported from `@mui/material/styles`.

#### Rule: Transient Props with `shouldForwardProp`
Custom styling props (such as `active`, `completed`, `isMax`, `risk`, `borderColor`) **must not leak into HTML DOM elements**. Always wrap them with `shouldForwardProp`:

```tsx
import { styled } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material';

export const WorkoutCardPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'borderColor' && prop !== 'completed',
})<{ borderColor: string; completed?: boolean }>(({ theme, borderColor, completed }) => ({
  padding: theme.spacing(1.75, 2),
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: `4px solid ${borderColor}`,
  opacity: completed ? 0.75 : 1,
  backgroundColor: completed
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)'
    : theme.palette.background.paper,
  transition: 'border-color 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#CBD5E1',
    borderLeftColor: borderColor,
  },
}));
```

### 6.2 Mobile: React Native StyleSheet Pattern
All mobile screens and components must use `StyleSheet.create` and reference tokens directly from `../theme`:

```tsx
import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  headerText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metricNumber: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});
```

---

## 7. Strict Prohibitions (Zero-Tolerance Anti-Patterns)

1. ❌ **No Raw Inline Styles**: Never write `style={{ color: '#10B981', padding: '10px' }}` in React JSX.
2. ❌ **No Ad-Hoc `sx` Pixel Blobs**: Never write `<Box sx={{ p: '13px', backgroundColor: '#181b20' }}>`.
3. ❌ **No Hardcoded Hex Colors**: All colors must resolve from `theme.palette.*` (Web) or `theme.colors.*` (Mobile).
4. ❌ **No Arbitrary Font Stacks**: Never declare inline `fontFamily: "Arial"` or generic browser defaults. Use the three designated font families (`Plus Jakarta Sans`, `Syne`, `Space Grotesk`).
5. ❌ **No Broken HTML Attribute Leakage**: Never pass boolean styling props to styled elements without `shouldForwardProp`.

---

## 8. Accessibility & Quality Gate (WCAG 2.1 AA)

- **Color Contrast**: All primary text readouts on dark void backgrounds must maintain a minimum contrast ratio of `7:1` (exceeding AAA standard). Secondary text (`#9CA3AF`) on void maintains `4.8:1` (passing AA standard).
- **Interactive Target Sizes**:
  - Web: Buttons, steppers, and inputs must have a minimum interactive touch target of `36px × 36px` (preferably `40px`).
  - Mobile: Touchable triggers must meet the minimum `44pt × 44pt` Apple Human Interface / Material guidelines.
- **Visual Focus States**: Keyboard tab navigation must render distinct focus outlines with primary brand contrast (`borderColor: #10B981`).
