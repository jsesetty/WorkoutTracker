export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type YukaRating = 'Excellent' | 'Good' | 'Mediocre' | 'Bad';

export type AdditiveRisk = 'None' | 'Low' | 'Moderate' | 'Hazardous';

export interface AdditiveInfo {
  readonly code: string;
  readonly name: string;
  readonly risk: AdditiveRisk;
  readonly description?: string;
}

export interface FoodItem {
  readonly id: string;
  readonly name: string;
  readonly brand?: string;
  readonly barcode?: string;
  readonly imageUrl?: string;
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly servingSize: string;
  readonly yukaScore: number; // 0 - 100
  readonly yukaRating: YukaRating;
  readonly additives: readonly AdditiveInfo[];
  readonly novaGroup: 1 | 2 | 3 | 4;
  readonly isOrganic?: boolean;
  readonly cleanAlternativeId?: string;
  readonly cleanAlternativeName?: string;
}

export interface LoggedMeal {
  readonly id: string;
  readonly foodId?: string;
  readonly name: string;
  readonly category: MealCategory;
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly yukaScore: number;
  readonly yukaRating: YukaRating;
  readonly servingSize?: string;
  readonly createdAt: string;
}

export interface NutritionGoals {
  readonly calorieTarget: number;
  readonly proteinTarget: number;
  readonly carbsTarget: number;
  readonly fatTarget: number;
  readonly waterTarget: number;
}

export interface CalorieBalanceSummary {
  readonly calorieTarget: number;
  readonly consumedCalories: number;
  readonly workoutBurnedCalories: number;
  readonly remainingCalories: number;
}
