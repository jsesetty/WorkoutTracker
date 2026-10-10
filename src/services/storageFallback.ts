import { WorkoutItem } from '../types/workout';
import { LoggedMeal, NutritionGoals, FoodItem } from '../types/nutrition';

const WORKOUTS_KEY = 'ironpulse-workouts';
const MEALS_KEY = 'ironpulse-meals';
const GOALS_KEY = 'ironpulse-goals';
const FOODS_KEY = 'ironpulse-foods';

export const DEFAULT_WORKOUTS: WorkoutItem[] = [
  {
    id: 'w-default-1',
    title: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    intensity: 'high',
    sets: 4,
    reps: 8,
    weight: '85 kg',
    setDetails: [
      { id: 'w-d1-s1', setNumber: 1, reps: 8, weight: '85 kg', completed: true },
      { id: 'w-d1-s2', setNumber: 2, reps: 8, weight: '85 kg', completed: true },
      { id: 'w-d1-s3', setNumber: 3, reps: 7, weight: '85 kg', completed: false },
      { id: 'w-d1-s4', setNumber: 4, reps: 6, weight: '85 kg', completed: false },
    ],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-default-2',
    title: 'Barbell Back Squat',
    muscleGroup: 'Legs',
    intensity: 'high',
    sets: 3,
    reps: 6,
    weight: '110 kg',
    setDetails: [
      { id: 'w-d2-s1', setNumber: 1, reps: 6, weight: '110 kg', completed: false },
      { id: 'w-d2-s2', setNumber: 2, reps: 6, weight: '110 kg', completed: false },
      { id: 'w-d2-s3', setNumber: 3, reps: 6, weight: '110 kg', completed: false },
    ],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-default-3',
    title: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    intensity: 'medium',
    sets: 3,
    reps: 10,
    weight: '32 kg',
    setDetails: [
      { id: 'w-d3-s1', setNumber: 1, reps: 10, weight: '32 kg', completed: false },
      { id: 'w-d3-s2', setNumber: 2, reps: 10, weight: '32 kg', completed: false },
      { id: 'w-d3-s3', setNumber: 3, reps: 10, weight: '32 kg', completed: false },
    ],
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_GOALS: NutritionGoals = {
  calorieTarget: 2200,
  proteinTarget: 165,
  carbsTarget: 220,
  fatTarget: 60,
  waterTarget: 3000,
};

export const DEFAULT_MEALS: LoggedMeal[] = [
  {
    id: 'meal-d-1',
    name: 'Oats with Whey, Berries & Almond Butter',
    category: 'Breakfast',
    calories: 520,
    protein: 42,
    carbs: 65,
    fat: 12,
    servingSize: '1 bowl',
    yukaScore: 92,
    yukaRating: 'Excellent',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meal-d-2',
    name: 'Grilled Chicken Breast with Jasmine Rice & Broccoli',
    category: 'Lunch',
    calories: 650,
    protein: 55,
    carbs: 75,
    fat: 14,
    servingSize: '350g plate',
    yukaScore: 95,
    yukaRating: 'Excellent',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meal-d-3',
    name: 'Greek Yogurt with Honey & Walnuts',
    category: 'Snacks',
    calories: 280,
    protein: 24,
    carbs: 22,
    fat: 10,
    servingSize: '200g',
    yukaScore: 88,
    yukaRating: 'Good',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_FOODS: FoodItem[] = [
  {
    id: 'food-d-1',
    name: 'Boneless Skinless Chicken Breast',
    brand: 'Kirkland Signature',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '150g',
    yukaScore: 94,
    yukaRating: 'Excellent',
    additives: [],
    novaGroup: 1,
    isOrganic: true,
    cleanAlternativeName: 'Wild-Caught Atlantic Cod',
  },
  {
    id: 'food-d-2',
    name: '100% Grass-Fed Whey Isolate',
    brand: 'Optimum Nutrition',
    calories: 375,
    protein: 80,
    carbs: 4,
    fat: 3,
    servingSize: '30g scoop',
    yukaScore: 88,
    yukaRating: 'Good',
    additives: [{ code: 'E955', name: 'Sucralose', risk: 'Moderate' }],
    novaGroup: 3,
    isOrganic: false,
    cleanAlternativeName: 'Naked Unflavored Whey (Stevia Sweetened)',
  },
  {
    id: 'food-d-3',
    name: 'Organic Rolled Oats',
    brand: "Bob's Red Mill",
    calories: 379,
    protein: 13,
    carbs: 67,
    fat: 6.5,
    servingSize: '50g',
    yukaScore: 98,
    yukaRating: 'Excellent',
    additives: [],
    novaGroup: 1,
    isOrganic: true,
  },
  {
    id: 'food-d-4',
    name: 'Extra Virgin Cold Pressed Olive Oil',
    brand: 'California Olive Ranch',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    servingSize: '15ml tbsp',
    yukaScore: 92,
    yukaRating: 'Excellent',
    additives: [],
    novaGroup: 2,
    isOrganic: true,
  },
];

export const storage = {
  getWorkouts(): WorkoutItem[] {
    try {
      const data = localStorage.getItem(WORKOUTS_KEY);
      return data ? JSON.parse(data) : DEFAULT_WORKOUTS;
    } catch {
      return DEFAULT_WORKOUTS;
    }
  },
  saveWorkouts(workouts: WorkoutItem[]): void {
    try {
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    } catch {
      // Ignore
    }
  },
  getGoals(): NutritionGoals {
    try {
      const data = localStorage.getItem(GOALS_KEY);
      return data ? JSON.parse(data) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  },
  getMeals(): LoggedMeal[] {
    try {
      const data = localStorage.getItem(MEALS_KEY);
      return data ? JSON.parse(data) : DEFAULT_MEALS;
    } catch {
      return DEFAULT_MEALS;
    }
  },
  saveMeals(meals: LoggedMeal[]): void {
    try {
      localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
    } catch {
      // Ignore
    }
  },
  getFoods(): FoodItem[] {
    try {
      const data = localStorage.getItem(FOODS_KEY);
      return data ? JSON.parse(data) : DEFAULT_FOODS;
    } catch {
      return DEFAULT_FOODS;
    }
  },
  saveFoods(foods: FoodItem[]): void {
    try {
      localStorage.setItem(FOODS_KEY, JSON.stringify(foods));
    } catch {
      // Ignore
    }
  },
};
