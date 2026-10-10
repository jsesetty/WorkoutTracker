import { Platform } from 'react-native';
import { WorkoutItem, LoggedMeal, NutritionGoal } from '../types';

// Default host based on platform
const DEFAULT_HOST = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

let customApiUrl = DEFAULT_HOST;

export const setApiUrl = (url: string): void => {
  customApiUrl = url;
};

export const getApiUrl = (): string => customApiUrl;

export const api = {
  // Workout Endpoints
  async getWorkouts(): Promise<WorkoutItem[]> {
    try {
      const response = await fetch(`${customApiUrl}/api/workouts`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch {
      // Fallback local items if server is offline
      return [
        {
          id: 'w-1',
          title: 'Barbell Bench Press',
          muscleGroup: 'Chest',
          completed: false,
          sets: [
            { id: 's-1', setNumber: 1, weightKg: 85, reps: 8, completed: true },
            { id: 's-2', setNumber: 2, weightKg: 85, reps: 8, completed: false },
            { id: 's-3', setNumber: 3, weightKg: 85, reps: 7, completed: false },
          ],
          targetSets: 3,
          targetReps: 8,
          targetWeightKg: 85,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'w-2',
          title: 'Barbell Back Squat',
          muscleGroup: 'Legs',
          completed: false,
          sets: [
            { id: 's-4', setNumber: 1, weightKg: 120, reps: 5, completed: false },
            { id: 's-5', setNumber: 2, weightKg: 120, reps: 5, completed: false },
          ],
          targetSets: 3,
          targetReps: 5,
          targetWeightKg: 120,
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  async addWorkout(workout: Omit<WorkoutItem, 'id' | 'createdAt'>): Promise<WorkoutItem> {
    const payload = {
      ...workout,
      id: `w-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await fetch(`${customApiUrl}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) return await response.json();
    } catch {
      // Offline fallback
    }
    return payload as WorkoutItem;
  },

  async toggleWorkout(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${customApiUrl}/api/workouts/${id}/toggle`, {
        method: 'PATCH',
      });
      return response.ok;
    } catch {
      return true;
    }
  },

  async deleteWorkout(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${customApiUrl}/api/workouts/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch {
      return true;
    }
  },

  // Nutrition Endpoints
  async getNutritionGoals(): Promise<NutritionGoal> {
    try {
      const response = await fetch(`${customApiUrl}/api/nutrition/goals`);
      if (!response.ok) throw new Error('Failed to fetch goals');
      return await response.json();
    } catch {
      return {
        dailyCalories: 2600,
        proteinGrams: 180,
        carbsGrams: 280,
        fatGrams: 65,
      };
    }
  },

  async getMeals(): Promise<LoggedMeal[]> {
    try {
      const response = await fetch(`${customApiUrl}/api/nutrition/meals`);
      if (!response.ok) throw new Error('Failed to fetch meals');
      return await response.json();
    } catch {
      return [
        {
          id: 'm-1',
          name: 'Oatmeal with Whey & Berries',
          mealType: 'Breakfast',
          calories: 520,
          proteinGrams: 45,
          carbsGrams: 65,
          fatGrams: 10,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'm-2',
          name: 'Grilled Chicken Breast & Rice',
          mealType: 'Lunch',
          calories: 680,
          proteinGrams: 58,
          carbsGrams: 75,
          fatGrams: 14,
          timestamp: new Date().toISOString(),
        },
      ];
    }
  },

  async addMeal(meal: Omit<LoggedMeal, 'id' | 'timestamp'>): Promise<LoggedMeal> {
    const payload = {
      ...meal,
      id: `m-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    try {
      const response = await fetch(`${customApiUrl}/api/nutrition/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) return await response.json();
    } catch {
      // Offline fallback
    }
    return payload as LoggedMeal;
  },
};
