export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio'
  | 'Full Body';

export type IntensityLevel = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'active' | 'completed';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number;
  weight?: string;
  completed: boolean;
}

export interface WorkoutItem {
  id: string;
  title: string;
  muscleGroup: MuscleGroup;
  intensity: IntensityLevel;
  sets?: number;
  completedSets?: number;
  reps?: string | number;
  weight?: string;
  setDetails?: WorkoutSet[];
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface WorkoutFilterCounts {
  all: number;
  active: number;
  completed: number;
}

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export interface TransformationRank {
  title: string;
  bp: string;
  color: string;
}
