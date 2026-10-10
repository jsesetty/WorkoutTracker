import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { WeightUnit, SettingsContextValue } from '../types/settings';

const STORAGE_KEY_UNIT = 'ironpulse-weight-unit';
const STORAGE_KEY_REST = 'ironpulse-rest-timer';
const STORAGE_KEY_SOUND = 'ironpulse-sound-enabled';

export function convertWeight(weightStr: string | undefined, toUnit: WeightUnit): string {
  if (!weightStr) return '';
  const trimmed = weightStr.trim();
  if (!trimmed) return '';

  const numMatch = trimmed.match(/^([0-9.]+)(.*)$/);
  if (!numMatch) return trimmed;

  const num = parseFloat(numMatch[1]);
  if (isNaN(num)) return trimmed;

  const rest = numMatch[2].trim().toLowerCase();
  const isLbs = rest.startsWith('lb') || rest.includes('pound');
  const isKg = rest.startsWith('kg') || rest.includes('kilo');
  const currentUnit: WeightUnit | null = isLbs ? 'lbs' : (isKg ? 'kg' : null);

  // If unit is already the target unit, preserve original
  if (currentUnit === toUnit) {
    return trimmed;
  }

  // Preserve trailing text modifiers like "/ side"
  const extraSuffix = rest.replace(/^(lbs?|kg)\s*/i, '').trim();
  const suffixPart = extraSuffix ? ` ${extraSuffix}` : '';

  if (toUnit === 'lbs') {
    // 1 kg = 2.2046226 lbs, rounded to nearest 0.5 lbs
    const converted = Math.round(num * 2.2046226 * 2) / 2;
    return `${converted} lbs${suffixPart}`;
  } else {
    // 1 lb = 0.45359237 kg, rounded to nearest 0.5 kg
    const converted = Math.round(num * 0.45359237 * 2) / 2;
    return `${converted} kg${suffixPart}`;
  }
}

export const SettingsContext = createContext<SettingsContextValue>({
  unit: 'kg',
  setUnit: () => {},
  restTimer: 90,
  setRestTimer: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  convertWeight,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnitState] = useState<WeightUnit>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_UNIT);
    return saved === 'lbs' ? 'lbs' : 'kg';
  });

  const [restTimer, setRestTimerState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REST);
    const parsed = saved ? parseInt(saved, 10) : 90;
    return [60, 90, 120, 180].includes(parsed) ? parsed : 90;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  const setUnit = useCallback((newUnit: WeightUnit) => {
    setUnitState(newUnit);
    localStorage.setItem(STORAGE_KEY_UNIT, newUnit);
  }, []);

  const setRestTimer = useCallback((seconds: number) => {
    setRestTimerState(seconds);
    localStorage.setItem(STORAGE_KEY_REST, String(seconds));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY_SOUND, String(enabled));
  }, []);

  const value = useMemo<SettingsContextValue>(() => ({
    unit,
    setUnit,
    restTimer,
    setRestTimer,
    soundEnabled,
    setSoundEnabled,
    convertWeight,
  }), [unit, setUnit, restTimer, setRestTimer, soundEnabled, setSoundEnabled]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => useContext(SettingsContext);
