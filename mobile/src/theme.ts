export const theme = {
  colors: {
    background: '#0A0D14',
    surface: '#121622',
    surfaceElevated: '#1A2030',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.16)',
    primary: '#FF5722', // Athletic Neon Amber / Orange
    primaryGlow: 'rgba(255, 87, 34, 0.25)',
    secondary: '#00E5FF', // Cyber Cyan
    success: '#00E676', // Electric Emerald
    warning: '#FFD600',
    error: '#FF1744',
    textPrimary: '#F0F4F8',
    textSecondary: '#8E9CAE',
    textMuted: '#556272',
    protein: '#FF5722',
    carbs: '#00E5FF',
    fats: '#FFD600',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 18,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
