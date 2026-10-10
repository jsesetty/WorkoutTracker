# IronPulse Design System Specification (`DESIGN.md`)

> **Scope**: Authoritative design contract, token catalog, and styling architecture for the IronPulse ecosystem across Web (`apps/web`) and Mobile (`apps/mobile`).  
> **Status**: Active & Mandatory. All UI components, page structures, data layouts, and agent-generated modifications must strictly comply with this document.

---

## 1. Anti-AI Slop Mandate & Core Aesthetic Identity

This system is engineered specifically to prevent generic generative AI UI tropes (such as loose Inter-font layouts, rounded-3xl pastel cards, violet/indigo mesh glows, and symmetric 3-box bento grids).

IronPulse follows an **Industrial Telemetry Console & Physical Rig Utility** aesthetic. The design language draws direct influence from precision competition machinery (Eleiko, Concept2, Rogue), mechanical athletic chronometers, and high-density telemetry consoles.

### Core Visual Directives
1. **Engineered Obsidian Base**: Deep obsidian canvas (`#090B0E`) without pastel tinting or floating ambient gradient blobs.
2. **Single Operational Action Accent**: Industrial Hazard Amber (`#FF5500`) is the single universal primary action and focus trigger across all platforms. Field Emerald (`#059669`) is reserved strictly for completed milestones, confirmed sets, and PR records.
3. **True Tabular Telemetry**: Numerical readouts, reps, barbell weights, timers, and timestamps are strictly rendered in true monospaced fonts with tabular figures (`tnum`).
4. **Machined Mechanical Geometry**: Low, restrained corner radii (`rounded-none` to `rounded-sm`, max 4px–6px) and crisp 1px structural borders replace soft, floating drop shadows.
5. **High Data Density Over Marketing Bento Boxes**: Prioritize split-pane viewports (e.g., 70% data workbench / 30% inspector panel), continuous log feeds, and structured tables over decorative cards with centered icons.

---

## 2. Hard Anti-Patterns (Strictly Banned)

Any code containing the following patterns will be rejected:

| Banned AI Trope | Why It Fails | Mandatory Replacement |
| :--- | :--- | :--- |
| **`rounded-2xl` / `rounded-3xl` cards** | Generates floaty, toy-like "bubble" UI. | Use `rounded-none`, `rounded-xs` (2px), or `rounded-sm` (4px). Max card radius is 6px. |
| **Purple/Indigo gradients & blur glows** | Hallmarks of generic LLM boilerplates. | Solid surfaces with crisp 1px division borders (`rgba(255, 255, 255, 0.08)`). Zero blurred mesh blobs. |
| **3-Column Bento Cards with centered Lucide icons** | Vague, low-density filler layout. | Tabular set logs, split-screen master-detail views, or compact control decks. |
| **Loose, floating drop shadows** | Makes interfaces feel detached and blurry. | Sharp 1px mechanical outlines and solid elevation layers (`#090B0E` → `#12151B` → `#181D26`). |
| **Bouncy hover transitions (`hover:scale-105`)** | Distracting and unnatural for performance apps. | Snappy, mechanical color/border shifts `<= 120ms ease-out`. |
| **Superlative placeholder text** | "Supercharge your fitness journey." | Concrete telemetry terminology: `"Log Set 3 @ 140kg"`, `"Rest Interval: 01:30"`. |

---

## 3. Typographic Architecture

IronPulse strictly segregates brand display, technical headings, general UI reading, and telemetry data:

```css
:root {
  --font-brand: 'Syne', sans-serif;
  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-telemetry: 'Geist Mono', 'JetBrains Mono', monospace;
}
```

### Typographic Roles & Rules
- **Brand Hero (`Syne`, 800 weight)**: Reserved solely for the `IRONPULSE` masthead and top-level launch screens.
- **Section Headers (`Space Grotesk`, 600–700 weight, `-0.03em` tracking)**: Page headings, drawer titles, exercise group names. Always compact and tight.
- **Body & Prose (`Plus Jakarta Sans`, 400–500 weight, 14px default base)**: System messages, movement cues, workout notes.
- **Telemetry & Figures (`Geist Mono` / `JetBrains Mono`, `fontVariant: ['tabular-nums']`)**: Rep counters, poundages, splits, heart rate readings, macro totals, and set tags.

---

## 4. Color Palette & Functional Token Catalog

### 4.1 Kinetic Brand & Action Tokens (Cross-Platform)

```typescript
export const tokens = {
  canvas: {
    void: '#090B0E',        // Deepest dark backdrop (Web & Mobile)
    surface: '#12151B',     // Active workbench cards and data rows
    elevated: '#181D26',    // Dropdown popovers, nested pods, inputs
    subtleBorder: 'rgba(255, 255, 255, 0.08)',
    activeBorder: 'rgba(255, 255, 255, 0.22)',
  },
  accent: {
    primary: '#FF5500',     // Industrial Hazard Amber (Primary CTAs, active states)
    primaryHover: '#E04B00',
    primarySubtle: 'rgba(255, 85, 0, 0.12)',
    success: '#059669',     // Field Emerald (Completed sets, verified PR flags)
    successSubtle: 'rgba(5, 150, 105, 0.14)',
    telemetryCyan: '#00D8F6', // Split times, glycogen status, pacing meters
    mutedSlate: '#5E697A',  // Column headers, inactive markers
  },
  text: {
    primary: '#F0F3F7',
    secondary: '#8893A4',
    muted: '#4F5868',
  },
  macros: {
    protein: '#FF5500',     // High-tension Amber
    carbs: '#00D8F6',       // Fast Glycogen Cyan
    fats: '#EAB308',        // Dense Gold
    balance: '#059669',     // Balanced Emerald
  }
} as const;
```

---

## 5. Spatial Geometry & Elevation System

### 5.1 Spacing Scale (Base 8pt Grid)
All padding, margin, and gap calculations must strictly adhere to the scale:
- **`xs`: 4px** (Tags, micro-steppers, inline badges)
- **`sm`: 8px** (Row gaps, chip padding, compact button padding)
- **`md`: 16px** (Card padding, form field gaps, table cell padding)
- **`lg`: 24px** (Module gaps, modal body padding)
- **`xl`: 32px** (Major screen dividers, split-pane gutters)

### 5.2 Radius Scale
- **`radius-none`: 0px** (Dense table cells, full-width split decks)
- **`radius-xs`: 2px** (Status indicators, inline telemetry pills)
- **`radius-sm`: 4px** (Inputs, primary CTAs, steppers)
- **`radius-md`: 6px** (Maximum allowed card and modal border radius)

> [!CAUTION]
> `rounded-xl` through `rounded-3xl` are strictly forbidden.

### 5.3 Elevation
No blurred box shadows on content cards. Elevation is indicated solely through solid surfaces and borders:

```css
/* Standard Workbench Card */
background-color: #12151B;
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: none;

/* Popover / Action Menu */
background-color: #181D26;
border: 1px solid rgba(255, 255, 255, 0.16);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);

/* Keyboard Focus */
outline: 2px solid #FF5500;
outline-offset: 2px;
```

---

## 6. Implementation Conventions

### 6.1 Web: Emotion / MUI Component Pattern
Never leak custom props to the DOM. Use `shouldForwardProp` and crisp mechanical borders:

```tsx
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const SetRowContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isCompleted' && prop !== 'isPR',
})<{ isCompleted?: boolean; isPR?: boolean }>(({ theme, isCompleted, isPR }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderRadius: '4px',
  backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.06)' : '#12151B',
  border: `1px solid ${
    isPR 
      ? '#FF5500' 
      : isCompleted 
        ? 'rgba(5, 150, 105, 0.35)' 
        : 'rgba(255, 255, 255, 0.08)'
  }`,
  transition: 'border-color 100ms ease-out, background-color 100ms ease-out',
  '&:hover': {
    borderColor: isCompleted ? '#059669' : 'rgba(255, 255, 255, 0.22)',
  },
}));
```

### 6.2 Mobile: React Native StyleSheet Pattern
Always declare explicit monospace tabular figures on numerical telemetry counters:

```tsx
import { StyleSheet } from 'react-native';
import { tokens } from '../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.canvas.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: tokens.canvas.subtleBorder,
    padding: 12,
  },
  label: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.text.secondary,
  },
  metricDisplay: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 24,
    color: tokens.accent.primary,
    fontVariant: ['tabular-nums'],
  },
});
```

---

## 7. Motion & Micro-Interactions

- **Duration**: Transition durations must be between 80ms and 120ms (`ease-out`). Avoid long floating eases.
- **State Confirmation**: Clicking a set confirmation or barcode scan trigger results in a distinct instantaneous color swap, not an expanding ripple or bouncing scale effect.
- **Scan HUD**: Viewfinder scanning indicators use a crisp 1px line (`#00D8F6`) traveling across the container with zero ambient gaussian blur.

---

## 8. Quality & Accessibility Verification Gate

- **Color Contrast**: Primary text (`#F0F3F7`) on base canvas (`#090B0E`) maintains a 17.4:1 contrast ratio (exceeds WCAG AAA). Secondary text (`#8893A4`) maintains a 5.8:1 ratio (exceeds WCAG AA).
- **Target Sizes**:
  - **Web**: Interactive inputs and stepper increment triggers must be at least 36px × 36px (ideal 40px).
  - **Mobile**: Touchable targets must strictly meet 44pt × 44pt.
- **Focus Indicators**: Keyboard tab navigation must render an unmistakable mechanical focus ring:
  ```css
  outline: 2px solid #FF5500;
  outline-offset: 2px;
  ```
