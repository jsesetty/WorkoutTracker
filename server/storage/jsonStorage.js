import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DATA_DIR,
  DATA_FILE_WORKOUTS,
  LEGACY_DATA_FILE,
  DATA_FILE_MEALS,
  DATA_FILE_FOODS,
  DATA_FILE_GOALS,
  DATA_FILE_CATALOG,
  DATA_FILE_SESSIONS
} from '../config/environment.js';

export const DEFAULT_WORKOUTS = [
  {
    id: 'workout-1',
    title: 'Barbell Flat Bench Press',
    muscleGroup: 'Chest',
    intensity: 'high',
    sets: 4,
    reps: '8-10',
    weight: '85 kg',
    completed: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 2400000).toISOString(),
    notes: 'Pyramid up to top working set',
    setDetails: [
      { id: 'w1-s1', setNumber: 1, reps: 10, weight: '80 kg', completed: true },
      { id: 'w1-s2', setNumber: 2, reps: 10, weight: '85 kg', completed: true },
      { id: 'w1-s3', setNumber: 3, reps: 8, weight: '85 kg', completed: true },
      { id: 'w1-s4', setNumber: 4, reps: 8, weight: '85 kg', completed: true },
    ]
  },
  {
    id: 'workout-2',
    title: 'Incline Dumbbell Chest Press',
    muscleGroup: 'Chest',
    intensity: 'medium',
    sets: 3,
    reps: '10-12',
    weight: '32 kg / side',
    completed: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    notes: 'Focus on 3-second eccentric tempo',
    setDetails: [
      { id: 'w2-s1', setNumber: 1, reps: 12, weight: '32 kg', completed: true },
      { id: 'w2-s2', setNumber: 2, reps: 10, weight: '32 kg', completed: false },
      { id: 'w2-s3', setNumber: 3, reps: 10, weight: '32 kg', completed: false },
    ]
  },
  {
    id: 'workout-3',
    title: 'Standing Overhead Military Press',
    muscleGroup: 'Shoulders',
    intensity: 'high',
    sets: 4,
    reps: '8-10',
    weight: '55 kg',
    completed: false,
    createdAt: new Date().toISOString(),
    notes: 'Full extension without hyperextending spine',
    setDetails: [
      { id: 'w3-s1', setNumber: 1, reps: 10, weight: '50 kg', completed: false },
      { id: 'w3-s2', setNumber: 2, reps: 8, weight: '55 kg', completed: false },
      { id: 'w3-s3', setNumber: 3, reps: 8, weight: '55 kg', completed: false },
      { id: 'w3-s4', setNumber: 4, reps: 8, weight: '55 kg', completed: false },
    ]
  },
  {
    id: 'workout-4',
    title: 'Cable Tricep Rope Pushdowns',
    muscleGroup: 'Arms',
    intensity: 'medium',
    sets: 3,
    reps: '12-15',
    weight: '28 kg',
    completed: false,
    createdAt: new Date().toISOString(),
    notes: 'Spread rope apart at bottom peak contraction',
    setDetails: [
      { id: 'w4-s1', setNumber: 1, reps: 15, weight: '25 kg', completed: false },
      { id: 'w4-s2', setNumber: 2, reps: 12, weight: '28 kg', completed: false },
      { id: 'w4-s3', setNumber: 3, reps: 12, weight: '28 kg', completed: false },
    ]
  },
  {
    id: 'workout-5',
    title: 'Hanging Leg Raises',
    muscleGroup: 'Core',
    intensity: 'low',
    sets: 3,
    reps: '15',
    completed: false,
    createdAt: new Date().toISOString(),
    notes: 'Controlled movement without momentum',
    setDetails: [
      { id: 'w5-s1', setNumber: 1, reps: 15, completed: false },
      { id: 'w5-s2', setNumber: 2, reps: 15, completed: false },
      { id: 'w5-s3', setNumber: 3, reps: 15, completed: false },
    ]
  }
];

export const DEFAULT_NUTRITION_GOALS = {
  calorieTarget: 2200,
  proteinTarget: 165,
  carbsTarget: 220,
  fatTarget: 60,
  waterTarget: 3000,
};

/**
 * Ensures data directory and JSON files exist
 */
export async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // 1. Workouts file
    try {
      await fs.access(DATA_FILE_WORKOUTS);
    } catch {
      let initialData = DEFAULT_WORKOUTS;
      try {
        const legacyRaw = await fs.readFile(LEGACY_DATA_FILE, 'utf-8');
        const legacyItems = JSON.parse(legacyRaw.replace(/^\uFEFF/, ''));
        if (Array.isArray(legacyItems) && legacyItems.length > 0) {
          initialData = legacyItems.map(item => ({
            id: item.id || `workout-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: item.title,
            muscleGroup: item.muscleGroup || 'Full Body',
            intensity: item.intensity || (['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium'),
            sets: item.sets || 3,
            reps: item.reps || '10',
            weight: item.weight || '',
            completed: Boolean(item.completed),
            createdAt: item.createdAt || new Date().toISOString(),
            completedAt: item.completedAt || undefined,
            notes: item.notes || ''
          }));
        }
      } catch {
        // Fall back to DEFAULT_WORKOUTS
      }
      await fs.writeFile(DATA_FILE_WORKOUTS, JSON.stringify(initialData, null, 2), 'utf-8');
    }

    // 2. Nutrition Goals
    try {
      await fs.access(DATA_FILE_GOALS);
    } catch {
      await fs.writeFile(DATA_FILE_GOALS, JSON.stringify(DEFAULT_NUTRITION_GOALS, null, 2), 'utf-8');
    }

    // 3. Meals
    try {
      await fs.access(DATA_FILE_MEALS);
    } catch {
      await fs.writeFile(DATA_FILE_MEALS, JSON.stringify([], null, 2), 'utf-8');
    }

    // 4. Foods
    try {
      await fs.access(DATA_FILE_FOODS);
    } catch {
      await fs.writeFile(DATA_FILE_FOODS, JSON.stringify([], null, 2), 'utf-8');
    }

    // 5. Sessions
    try {
      await fs.access(DATA_FILE_SESSIONS);
    } catch {
      await fs.writeFile(DATA_FILE_SESSIONS, JSON.stringify([], null, 2), 'utf-8');
    }

    // 6. Catalog
    try {
      await fs.access(DATA_FILE_CATALOG);
    } catch {
      await fs.writeFile(DATA_FILE_CATALOG, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring data files:', err);
  }
}

// Workouts I/O
export async function getWorkouts() {
  await ensureDataFiles();
  try {
    const raw = await fs.readFile(DATA_FILE_WORKOUTS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (err) {
    console.error('Error reading workouts file:', err);
    return [];
  }
}

export async function saveWorkouts(workouts) {
  await ensureDataFiles();
  await fs.writeFile(DATA_FILE_WORKOUTS, JSON.stringify(workouts, null, 2), 'utf-8');
}

// Meals I/O
export async function getMeals() {
  try {
    const raw = await fs.readFile(DATA_FILE_MEALS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

export async function saveMeals(meals) {
  await fs.writeFile(DATA_FILE_MEALS, JSON.stringify(meals, null, 2), 'utf-8');
}

// Foods I/O
export async function getFoods() {
  try {
    const raw = await fs.readFile(DATA_FILE_FOODS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

export async function saveFoods(foods) {
  await fs.writeFile(DATA_FILE_FOODS, JSON.stringify(foods, null, 2), 'utf-8');
}

// Nutrition Goals I/O
export async function getNutritionGoals() {
  try {
    const raw = await fs.readFile(DATA_FILE_GOALS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return DEFAULT_NUTRITION_GOALS;
  }
}

export async function saveNutritionGoals(goals) {
  await fs.writeFile(DATA_FILE_GOALS, JSON.stringify(goals, null, 2), 'utf-8');
}

// Catalog I/O
export async function getCatalog() {
  try {
    const raw = await fs.readFile(DATA_FILE_CATALOG, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

export async function saveCatalog(catalog) {
  await fs.writeFile(DATA_FILE_CATALOG, JSON.stringify(catalog, null, 2), 'utf-8');
}

// Sessions I/O
export async function getSessions() {
  try {
    const raw = await fs.readFile(DATA_FILE_SESSIONS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

export async function saveSessions(sessions) {
  await fs.writeFile(DATA_FILE_SESSIONS, JSON.stringify(sessions, null, 2), 'utf-8');
}
