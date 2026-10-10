import { createTheme, Theme } from '@mui/material/styles';

export const getGymTheme = (mode: 'dark' | 'light' = 'dark'): Theme => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF5500', // Industrial Hazard Amber
        light: 'rgba(255, 85, 0, 0.2)',
        dark: '#E04B00',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#5E697A', // Muted Slate
        light: '#8893A4',
        dark: '#3A4250',
        contrastText: '#FFFFFF',
      },
      info: {
        main: '#00D8F6', // Telemetry Cyan
        light: '#66E8FC',
        dark: '#00ADC5',
        contrastText: '#090B0E',
      },
      warning: {
        main: '#EAB308', // Dense Gold
        light: '#FACC15',
        dark: '#CA8A04',
        contrastText: '#090B0E',
      },
      success: {
        main: '#059669', // Field Emerald
        light: '#10B981',
        dark: '#047857',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#EF4444', // Hazard Red
        light: '#F87171',
        dark: '#DC2626',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#090B0E' : '#FAFAFA', // Obsidian Canvas
        paper: isDark ? '#12151B' : '#FFFFFF',   // Active Workbench
      },
      text: {
        primary: isDark ? '#F0F3F7' : '#111827',
        secondary: isDark ? '#8893A4' : '#5E697A',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.03em',
      },
      h3: {
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h4: {
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.015em',
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
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      },
      caption: {
        fontFamily: "'Space Grotesk', sans-serif",
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#090B0E' : '#FAFAFA',
            minHeight: '100vh',
            transition: 'background-color 0.12s ease-out, color 0.12s ease-out',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#12151B' : '#FFFFFF',
            borderRadius: 4,
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid #E5E7EB',
            boxShadow: 'none',
            transition: 'border-color 0.1s ease-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            padding: '7px 16px',
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            boxShadow: 'none',
            transition: 'all 0.1s ease-out',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: '#FF5500',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#E04B00',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            borderRadius: 2,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 6,
            borderRadius: 2,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
          },
          bar: {
            borderRadius: 2,
            backgroundColor: '#FF5500',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 38,
          },
          indicator: {
            backgroundColor: '#FF5500',
            height: 2,
            borderRadius: 0,
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
            letterSpacing: '0.03em',
            padding: '6px 14px',
            textTransform: 'uppercase',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: isDark ? '#181D26' : '#FFFFFF',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : '#9CA3AF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF5500',
            },
          },
          notchedOutline: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
          },
        },
      },
    },
  });
};

export const getDbzTheme = getGymTheme;
