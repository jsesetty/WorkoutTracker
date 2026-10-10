export interface WorkingSet {
  readonly id: string;
  readonly setNumber: number;
  readonly weightKg: number;
  readonly reps: number;
  readonly rpe?: number;
  readonly completed: boolean;
}

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio'
  | 'Full Body';

export interface WorkoutItem {
  readonly id: string;
  readonly title: string;
  readonly muscleGroup: MuscleGroup;
  readonly completed: boolean;
  readonly sets: WorkingSet[];
  readonly targetSets: number;
  readonly targetReps: number;
  readonly targetWeightKg: number;
  readonly notes?: string;
  readonly createdAt: string;
}

export interface MacroTargets {
  readonly calories: number;
  readonly proteinGrams: number;
  readonly carbsGrams: number;
  readonly fatGrams: number;
}

export interface LoggedMeal {
  readonly id: string;
  readonly name: string;
  readonly mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  readonly calories: number;
  readonly proteinGrams: number;
  readonly carbsGrams: number;
  readonly fatGrams: number;
  readonly timestamp: string;
}

export interface NutritionGoal {
  readonly dailyCalories: number;
  readonly proteinGrams: number;
  readonly carbsGrams: number;
  readonly fatGrams: number;
}
