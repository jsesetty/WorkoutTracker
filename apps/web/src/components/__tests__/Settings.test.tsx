import { render, screen, renderHook, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { SettingsProvider, useSettings, convertWeight } from '../../context/SettingsContext';
import { SettingsPage } from '../../pages/SettingsPage';
import { AuthProvider } from '../../auth/AuthProvider';
import { getGymTheme } from '../../theme';

describe('Settings & Unit Conversion Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('convertWeight Utility', () => {
    test('converts kg to lbs accurately with 0.5 precision', () => {
      expect(convertWeight('85 kg', 'lbs')).toBe('187.5 lbs');
      expect(convertWeight('40 kg', 'lbs')).toBe('88 lbs');
      expect(convertWeight('100 kg', 'lbs')).toBe('220.5 lbs');
    });

    test('converts lbs to kg accurately with 0.5 precision', () => {
      expect(convertWeight('187.5 lbs', 'kg')).toBe('85 kg');
      expect(convertWeight('88 lbs', 'kg')).toBe('40 kg');
      expect(convertWeight('220.5 lbs', 'kg')).toBe('100 kg');
    });

    test('preserves extra modifiers like / side', () => {
      expect(convertWeight('32 kg / side', 'lbs')).toBe('70.5 lbs / side');
      expect(convertWeight('70.5 lbs / side', 'kg')).toBe('32 kg / side');
    });

    test('handles empty or non-numeric strings safely', () => {
      expect(convertWeight('', 'lbs')).toBe('');
      expect(convertWeight(undefined, 'lbs')).toBe('');
      expect(convertWeight('Bodyweight', 'lbs')).toBe('Bodyweight');
    });

    test('does not convert if already matching target unit', () => {
      expect(convertWeight('185 lbs', 'lbs')).toBe('185 lbs');
      expect(convertWeight('80 kg', 'kg')).toBe('80 kg');
    });
  });

  describe('SettingsContext Provider & Hook', () => {
    test('defaults to kg, 90s rest timer, and soundEnabled true', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      expect(result.current.unit).toBe('kg');
      expect(result.current.restTimer).toBe(90);
      expect(result.current.soundEnabled).toBe(true);
    });

    test('persists unit changes to localStorage', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setUnit('lbs');
      });

      expect(result.current.unit).toBe('lbs');
      expect(localStorage.getItem('ironpulse-weight-unit')).toBe('lbs');

      act(() => {
        result.current.setUnit('kg');
      });

      expect(result.current.unit).toBe('kg');
      expect(localStorage.getItem('ironpulse-weight-unit')).toBe('kg');
    });

    test('persists rest timer and sound changes to localStorage', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setRestTimer(120);
        result.current.setSoundEnabled(false);
      });

      expect(result.current.restTimer).toBe(120);
      expect(result.current.soundEnabled).toBe(false);
      expect(localStorage.getItem('ironpulse-rest-timer')).toBe('120');
      expect(localStorage.getItem('ironpulse-sound-enabled')).toBe('false');
    });
  });

  describe('SettingsPage Component', () => {
    test('renders settings page and displays current unit', () => {
      render(
        <ThemeProvider theme={getGymTheme('dark')}>
          <AuthProvider>
            <SettingsProvider>
              <SettingsPage mode="dark" onToggleTheme={jest.fn()} />
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      );

      expect(screen.getByText('TRACKER PREFERENCES & SETTINGS')).toBeInTheDocument();
      expect(screen.getByText('Weight Measurement Units')).toBeInTheDocument();
      expect(screen.getByText('Default Rest Timer Interval')).toBeInTheDocument();
    });
  });
});
