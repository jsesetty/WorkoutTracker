export type WeightUnit = 'kg' | 'lbs';

export interface UserPreferences {
  readonly unit: WeightUnit;
  readonly restTimer: number;
  readonly soundEnabled: boolean;
}

export interface SettingsContextValue extends UserPreferences {
  readonly setUnit: (unit: WeightUnit) => void;
  readonly setRestTimer: (seconds: number) => void;
  readonly setSoundEnabled: (enabled: boolean) => void;
  readonly convertWeight: (weightStr: string | undefined, toUnit: WeightUnit) => string;
}
