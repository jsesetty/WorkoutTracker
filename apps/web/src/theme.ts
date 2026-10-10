import { createTheme, Theme } from '@mui/material/styles';

export const getGymTheme = (mode: 'dark' | 'light' = 'dark'): Theme => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#10B981', // Studio Emerald
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#64748B', // Titanium Slate
        light: '#94A3B8',
        dark: '#475569',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#F59E0B', // Amber
        light: '#FBBF24',
        dark: '#D97706',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#EF4444', // Crimson Red
        light: '#F87171',
        dark: '#DC2626',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#111317' : '#FAFAFA',
        paper: isDark ? '#181B20' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F3F4F6' : '#111827',
        secondary: isDark ? '#9CA3AF' : '#6B7280',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.015em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
      },
      subtitle2: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 500,
      },
      button: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      },
      caption: {
        fontFamily: "'Space Grotesk', sans-serif",
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#111317' : '#FAFAFA',
            minHeight: '100vh',
            transition: 'background-color 0.2s ease, color 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#181B20' : '#FFFFFF',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid #E5E7EB',
            boxShadow: isDark
              ? '0 1px 3px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#059669',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            borderRadius: 6,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 8,
            borderRadius: 4,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
          },
          bar: {
            borderRadius: 4,
            backgroundColor: '#10B981',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 40,
          },
          indicator: {
            backgroundColor: '#10B981',
            height: 2,
            borderRadius: 1,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 36,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.02em',
            padding: '6px 14px',
            textTransform: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : '#9CA3AF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#10B981',
            },
          },
          notchedOutline: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB',
          },
        },
      },
    },
  });
};

export const getDbzTheme = getGymTheme;
