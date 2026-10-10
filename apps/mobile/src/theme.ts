export const tokens = {
  canvas: {
    void: '#090B0E',        // Deepest dark backdrop
    surface: '#12151B',     // Active workbench cards and data rows
    elevated: '#181D26',    // Dropdown popovers, nested pods, inputs
    subtleBorder: 'rgba(255, 255, 255, 0.08)',
    activeBorder: 'rgba(255, 255, 255, 0.22)',
  },
  accent: {
    primary: '#FF5500',     // Industrial Hazard Amber
    primaryHover: '#E04B00',
    primarySubtle: 'rgba(255, 85, 0, 0.12)',
    success: '#059669',     // Field Emerald (Completed sets, verified PR flags)
    successSubtle: 'rgba(5, 150, 105, 0.14)',
    telemetryCyan: '#00D8F6', // Split times, pacing meters
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
  },
} as const;

export const theme = {
  colors: {
    background: tokens.canvas.void,
    surface: tokens.canvas.surface,
    surfaceElevated: tokens.canvas.elevated,
    border: tokens.canvas.subtleBorder,
    borderLight: tokens.canvas.activeBorder,
    primary: tokens.accent.primary,
    primaryGlow: 'rgba(255, 85, 0, 0.25)',
    secondary: tokens.accent.telemetryCyan,
    success: tokens.accent.success,
    warning: tokens.macros.fats,
    error: '#EF4444',
    textPrimary: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    textMuted: tokens.text.muted,
    protein: tokens.macros.protein,
    carbs: tokens.macros.carbs,
    fats: tokens.macros.fats,
    balance: tokens.macros.balance,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
export type Tokens = typeof tokens;
