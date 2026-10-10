import express from 'express';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'workouts.json');
const LEGACY_DATA_FILE = path.join(__dirname, 'data', 'todos.json');
const DATA_FILE_MEALS = path.join(__dirname, 'data', 'meals.json');
const DATA_FILE_FOODS = path.join(__dirname, 'data', 'foods.json');
const DATA_FILE_GOALS = path.join(__dirname, 'data', 'nutrition_goals.json');
const DATA_FILE_CATALOG = path.join(__dirname, 'data', 'catalog.json');
const DATA_FILE_SESSIONS = path.join(__dirname, 'data', 'sessions.json');

// Middleware
app.use(express.json());

// Enable CORS for cross-origin client access (e.g. GitHub Pages & Mobile)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve dist (built React app) if available, otherwise serve public
const distPath = fsSync.existsSync(path.join(__dirname, 'apps', 'web', 'dist'))
  ? path.join(__dirname, 'apps', 'web', 'dist')
  : path.join(__dirname, 'dist');
const publicPath = fsSync.existsSync(path.join(__dirname, 'apps', 'web', 'public'))
  ? path.join(__dirname, 'apps', 'web', 'public')
  : path.join(__dirname, 'public');
const staticPath = fsSync.existsSync(distPath) ? distPath : publicPath;
app.use(express.static(staticPath));

// Initial default gym training session exercises
const DEFAULT_WORKOUTS = [
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

// Helper functions for reading/writing persistent data
async function ensureDataFile() {
  try {
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    try {
      await fs.access(DATA_FILE);
    } catch {
      // If legacy todos.json exists, migrate it
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

      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring workout data file:', err);
  }
}

async function getWorkouts() {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (err) {
    console.error('Error parsing workouts file:', err);
    return [];
  }
}

async function saveWorkouts(workouts) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(workouts, null, 2), 'utf-8');
}

// REST API Handlers

// 1. Get all workouts
const handleGetWorkouts = async (req, res) => {
  try {
    const workouts = await getWorkouts();
    res.json(workouts);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve workouts' });
  }
};
app.get('/api/workouts', handleGetWorkouts);
app.get('/api/todos', handleGetWorkouts);

// 2. Add a new workout
const handleAddWorkout = async (req, res) => {
  try {
    const { title, muscleGroup, intensity, priority, sets, reps, weight, notes, setDetails } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Exercise title is required' });
    }

    const validMuscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];
    const resolvedMuscleGroup = validMuscleGroups.includes(muscleGroup) ? muscleGroup : 'Chest';
    const resolvedIntensity = ['low', 'medium', 'high'].includes(intensity)
      ? intensity
      : (['low', 'medium', 'high'].includes(priority) ? priority : 'medium');

    const resolvedSets = typeof sets === 'number' && sets > 0 ? sets : 3;
    const resolvedReps = reps ? String(reps).trim() : '10';
    const parsedReps = parseInt(resolvedReps, 10) || 10;

    const initialSetDetails = Array.isArray(setDetails) && setDetails.length > 0
      ? setDetails
      : Array.from({ length: resolvedSets }, (_, idx) => ({
        id: `set-${Date.now()}-${idx + 1}`,
        setNumber: idx + 1,
        reps: parsedReps,
        weight: weight ? String(weight).trim() : '',
        completed: false
      }));

    const workouts = await getWorkouts();
    const newWorkout = {
      id: 'workout-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      muscleGroup: resolvedMuscleGroup,
      intensity: resolvedIntensity,
      sets: initialSetDetails.length,
      reps: resolvedReps,
      weight: weight ? String(weight).trim() : '',
      setDetails: initialSetDetails,
      completed: false,
      createdAt: new Date().toISOString(),
      notes: notes ? String(notes).trim() : ''
    };

    workouts.unshift(newWorkout);
    await saveWorkouts(workouts);
    res.status(201).json(newWorkout);
  } catch {
    res.status(500).json({ error: 'Failed to create workout' });
  }
};
app.post('/api/workouts', handleAddWorkout);
app.post('/api/todos', handleAddWorkout);

// 3. Update / Toggle a workout
const handleUpdateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, intensity, priority, muscleGroup, sets, reps, weight, notes, setDetails } = req.body;
    const workouts = await getWorkouts();
    const index = workouts.findIndex(w => w.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (Array.isArray(setDetails)) {
      workouts[index].setDetails = setDetails;
      workouts[index].sets = setDetails.length;
      const allSetsDone = setDetails.length > 0 && setDetails.every(s => s.completed);
      if (completed === undefined) {
        workouts[index].completed = allSetsDone;
        if (allSetsDone) {
          workouts[index].completedAt = new Date().toISOString();
        } else {
          delete workouts[index].completedAt;
        }
      }
    }

    if (typeof completed === 'boolean') {
      workouts[index].completed = completed;
      if (completed) {
        workouts[index].completedAt = new Date().toISOString();
        // If whole workout is marked completed, mark all sets completed as well
        if (Array.isArray(workouts[index].setDetails)) {
          workouts[index].setDetails = workouts[index].setDetails.map(s => ({ ...s, completed: true }));
        }
      } else {
        delete workouts[index].completedAt;
      }
    }

    if (title && typeof title === 'string' && title.trim()) {
      workouts[index].title = title.trim();
    }

    if (muscleGroup && typeof muscleGroup === 'string') {
      workouts[index].muscleGroup = muscleGroup;
    }

    if (intensity && ['low', 'medium', 'high'].includes(intensity)) {
      workouts[index].intensity = intensity;
    } else if (priority && ['low', 'medium', 'high'].includes(priority)) {
      workouts[index].intensity = priority;
    }

    if (typeof sets === 'number' && sets > 0) {
      workouts[index].sets = sets;
    }

    if (reps !== undefined) {
      workouts[index].reps = String(reps);
    }

    if (weight !== undefined) {
      workouts[index].weight = String(weight);
    }

    if (notes !== undefined) {
      workouts[index].notes = String(notes);
    }

    await saveWorkouts(workouts);
    res.json(workouts[index]);
  } catch {
    res.status(500).json({ error: 'Failed to update workout' });
  }
};
app.patch('/api/workouts/:id', handleUpdateWorkout);
app.patch('/api/todos/:id', handleUpdateWorkout);

// 4. Delete a single workout
const handleDeleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    let workouts = await getWorkouts();
    const exists = workouts.some(w => w.id === id);

    if (!exists) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    workouts = workouts.filter(w => w.id !== id);
    await saveWorkouts(workouts);
    res.json({ success: true, id });
  } catch {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};
app.delete('/api/workouts/:id', handleDeleteWorkout);
app.delete('/api/todos/:id', handleDeleteWorkout);

// 5. Clear all completed workouts
const handleClearCompleted = async (req, res) => {
  try {
    let workouts = await getWorkouts();
    const initialCount = workouts.length;
    workouts = workouts.filter(w => !w.completed);
    const removedCount = initialCount - workouts.length;
    await saveWorkouts(workouts);
    res.json({ success: true, removedCount });
  } catch {
    res.status(500).json({ error: 'Failed to clear completed workouts' });
  }
};
app.delete('/api/workouts-completed', handleClearCompleted);
app.delete('/api/todos-completed', handleClearCompleted);

// Helper functions for Meals, Foods, and Nutrition Goals
async function getMeals() {
  try {
    const raw = await fs.readFile(DATA_FILE_MEALS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

async function saveMeals(meals) {
  await fs.writeFile(DATA_FILE_MEALS, JSON.stringify(meals, null, 2), 'utf-8');
}

async function getFoods() {
  try {
    const raw = await fs.readFile(DATA_FILE_FOODS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

async function saveFoods(foods) {
  await fs.writeFile(DATA_FILE_FOODS, JSON.stringify(foods, null, 2), 'utf-8');
}

async function getNutritionGoals() {
  try {
    const raw = await fs.readFile(DATA_FILE_GOALS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return {
      calorieTarget: 2200,
      proteinTarget: 165,
      carbsTarget: 220,
      fatTarget: 60,
      waterTarget: 3000,
    };
  }
}

async function saveNutritionGoals(goals) {
  await fs.writeFile(DATA_FILE_GOALS, JSON.stringify(goals, null, 2), 'utf-8');
}

// 6. Meals Endpoints
app.get('/api/meals', async (req, res) => {
  try {
    const meals = await getMeals();
    res.json(meals);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve meals' });
  }
});

app.post('/api/meals', async (req, res) => {
  try {
    const { name, category, calories, protein, carbs, fat, foodId, yukaScore, yukaRating, servingSize } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Meal name is required' });
    }
    const meals = await getMeals();
    const newMeal = {
      id: 'meal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      foodId: foodId || undefined,
      name: name.trim(),
      category: category || 'Breakfast',
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      servingSize: servingSize || '1 serving',
      yukaScore: typeof yukaScore === 'number' ? yukaScore : 85,
      yukaRating: yukaRating || 'Good',
      createdAt: new Date().toISOString()
    };
    meals.unshift(newMeal);
    await saveMeals(meals);
    res.status(201).json(newMeal);
  } catch {
    res.status(500).json({ error: 'Failed to save meal' });
  }
});

app.delete('/api/meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let meals = await getMeals();
    meals = meals.filter(m => m.id !== id);
    await saveMeals(meals);
    res.json({ success: true, id });
  } catch {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// 7. Foods Endpoints
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await getFoods();
    res.json(foods);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve foods' });
  }
});

app.post('/api/foods', async (req, res) => {
  try {
    const { name, brand, calories, protein, carbs, fat, servingSize, isOrganic, novaGroup, additives } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Food name is required' });
    }
    const foods = await getFoods();
    const score = isOrganic ? 95 : 75;
    const rating = score >= 90 ? 'Excellent' : 'Good';
    const newFood = {
      id: 'food-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      brand: brand || 'Custom Fuel',
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      servingSize: servingSize || '100g',
      yukaScore: score,
      yukaRating: rating,
      additives: Array.isArray(additives) ? additives : [],
      novaGroup: typeof novaGroup === 'number' ? novaGroup : (isOrganic ? 1 : 2),
      isOrganic: Boolean(isOrganic)
    };
    foods.unshift(newFood);
    await saveFoods(foods);
    res.status(201).json(newFood);
  } catch {
    res.status(500).json({ error: 'Failed to save food' });
  }
});

// 8. Nutrition Goals Endpoints
app.get('/api/nutrition-goals', async (req, res) => {
  try {
    const goals = await getNutritionGoals();
    res.json(goals);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve nutrition goals' });
  }
});

app.put('/api/nutrition-goals', async (req, res) => {
  try {
    const goals = await getNutritionGoals();
    const updated = { ...goals, ...req.body };
    await saveNutritionGoals(updated);
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update nutrition goals' });
  }
});

// 9. Canonical Exercise Catalog API
async function getCatalog() {
  try {
    const raw = await fs.readFile(DATA_FILE_CATALOG, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

app.get('/api/v1/catalog', async (req, res) => {
  try {
    const catalog = await getCatalog();
    res.json(catalog);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve exercise catalog' });
  }
});

// 10. Idempotent Offline Sync Endpoint
async function getSessions() {
  try {
    const raw = await fs.readFile(DATA_FILE_SESSIONS, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

async function saveSessions(sessions) {
  const dataDir = path.dirname(DATA_FILE_SESSIONS);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(DATA_FILE_SESSIONS, JSON.stringify(sessions, null, 2), 'utf-8');
}

app.post('/api/v1/sync', async (req, res) => {
  try {
    const { sessions = [], exercises = [], sets = [] } = req.body || {};
    const existingSessions = await getSessions();
    const sessionMap = new Map(existingSessions.map(s => [s.id, s]));

    for (const incomingSession of sessions) {
      if (!incomingSession.id) continue;
      const existing = sessionMap.get(incomingSession.id);
      if (!existing || new Date(incomingSession.updatedAt || 0) >= new Date(existing.updatedAt || 0)) {
        sessionMap.set(incomingSession.id, incomingSession);
      }
    }

    const merged = Array.from(sessionMap.values());
    await saveSessions(merged);

    res.json({
      success: true,
      syncedSessionCount: sessions.length,
      syncedExerciseCount: exercises.length,
      syncedSetCount: sets.length,
      serverTimestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Sync batch processing error:', err);
    res.status(500).json({ error: 'Failed to process sync batch' });
  }
});

// SPA fallback handler
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexHtml = fsSync.existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(publicPath, 'index.html');
  res.sendFile(indexHtml);
});

// Initialize data file and start server
await ensureDataFile();

app.listen(PORT, () => {
  console.log(`IronPulse Gym Tracker server running on http://localhost:${PORT}`);
});
