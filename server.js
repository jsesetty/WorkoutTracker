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
      // Upsert fallback: if workout was created offline with client UUID, persist it
      const allSetsDone = Array.isArray(setDetails) && setDetails.length > 0 && setDetails.every(s => s.completed);
      const newWorkout = {
        id,
        title: title || 'Logged Exercise',
        muscleGroup: muscleGroup || 'Chest',
        intensity: intensity || priority || 'medium',
        sets: typeof sets === 'number' ? sets : (Array.isArray(setDetails) ? setDetails.length : 3),
        reps: reps !== undefined ? String(reps) : '10',
        weight: weight !== undefined ? String(weight) : '',
        completed: typeof completed === 'boolean' ? completed : Boolean(allSetsDone),
        createdAt: new Date().toISOString(),
        notes: notes || '',
        setDetails: Array.isArray(setDetails) ? setDetails : []
      };
      workouts.push(newWorkout);
      await saveWorkouts(workouts);
      return res.status(200).json(newWorkout);
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

// Batch sync endpoint for offline outbox reconciliation
app.post('/api/v1/sync', async (req, res) => {
  try {
    const { exercises } = req.body || {};
    let workouts = await getWorkouts();
    let updatedCount = 0;

    if (Array.isArray(exercises)) {
      for (const item of exercises) {
        if (!item || !item.id) continue;
        const idx = workouts.findIndex(w => w.id === item.id);
        if (idx !== -1) {
          workouts[idx] = { ...workouts[idx], ...item };
        } else {
          workouts.unshift(item);
        }
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      await saveWorkouts(workouts);
    }

    res.json({
      success: true,
      syncedAt: new Date().toISOString(),
      count: updatedCount
    });
  } catch {
    res.status(500).json({ error: 'Sync failed' });
  }
});

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

// Additives Risk Database
const ADDITIVES_DATABASE = {
  e250: { code: 'E250', name: 'Sodium Nitrite', risk: 'Hazardous', description: 'Preservative with carcinogenic nitrosamine risk' },
  e129: { code: 'E129', name: 'Allura Red AC (Red 40)', risk: 'Hazardous', description: 'Azo dye linked to hyperactivity and sensitivity' },
  e211: { code: 'E211', name: 'Sodium Benzoate', risk: 'Hazardous', description: 'Preservative that can form benzene when combined with Vitamin C' },
  e951: { code: 'E951', name: 'Aspartame', risk: 'Hazardous', description: 'Synthetic sweetener with possible neurological effects' },
  e950: { code: 'E950', name: 'Acesulfame K', risk: 'Moderate', description: 'Artificial sweetener' },
  e955: { code: 'E955', name: 'Sucralose', risk: 'Moderate', description: 'Artificial organochlorine sweetener' },
  e338: { code: 'E338', name: 'Phosphoric Acid', risk: 'Moderate', description: 'Acidifier that reduces bone mineral density' },
  e621: { code: 'E621', name: 'Monosodium Glutamate (MSG)', risk: 'Moderate', description: 'Synthetic flavor enhancer' },
  e150d: { code: 'E150d', name: 'Ammonia Caramel', risk: 'Moderate', description: 'Colorant with 4-MEI residue' },
  e150c: { code: 'E150c', name: 'Ammonia Caramel', risk: 'Moderate', description: 'Colorant with potential immune suppression' },
  e471: { code: 'E471', name: 'Mono- and diglycerides', risk: 'Low', description: 'Synthetic emulsifier' },
  e407: { code: 'E407', name: 'Carrageenan', risk: 'Moderate', description: 'Thickener linked to intestinal inflammation' },
  e300: { code: 'E300', name: 'Ascorbic Acid (Vitamin C)', risk: 'None', description: 'Natural antioxidant' },
  e322: { code: 'E322', name: 'Lecithins', risk: 'None', description: 'Natural emulsifier from soy or sunflower' },
  e960: { code: 'E960', name: 'Steviol glycosides', risk: 'None', description: 'Natural plant extract sweetener' },
  e415: { code: 'E415', name: 'Xanthan Gum', risk: 'Low', description: 'Natural fermentation stabilizer' },
  e412: { code: 'E412', name: 'Guar Gum', risk: 'Low', description: 'Plant seed thickener' },
};

function calculateYukaScore(nutriscoreGrade, additives, isOrganic, calories = 0, protein = 0) {
  let nutriBase = 65;
  if (nutriscoreGrade) {
    const grade = String(nutriscoreGrade).toLowerCase();
    if (grade === 'a') nutriBase = 100;
    else if (grade === 'b') nutriBase = 80;
    else if (grade === 'c') nutriBase = 60;
    else if (grade === 'd') nutriBase = 40;
    else if (grade === 'e') nutriBase = 20;
  } else {
    if (protein >= 20 && calories < 250) nutriBase = 85;
    else if (protein >= 10 && calories < 200) nutriBase = 75;
    else if (calories > 350) nutriBase = 45;
  }

  let additiveBase = 100;
  for (const add of additives) {
    if (add.risk === 'Hazardous') additiveBase -= 30;
    else if (add.risk === 'Moderate') additiveBase -= 15;
    else if (add.risk === 'Low') additiveBase -= 5;
  }
  additiveBase = Math.max(0, additiveBase);

  const organicBonus = isOrganic ? 100 : 0;
  const score = Math.min(100, Math.max(1, Math.round(
    (nutriBase * 0.60) + (additiveBase * 0.30) + (organicBonus * 0.10)
  )));

  let rating = 'Mediocre';
  if (score >= 75) rating = 'Excellent';
  else if (score >= 50) rating = 'Good';
  else if (score >= 25) rating = 'Mediocre';
  else rating = 'Bad';

  return { score, rating };
}

// Barcode lookup endpoint (Local Cache + Open Food Facts Proxy)
const handleBarcodeLookup = async (req, res) => {
  try {
    const rawBarcode = req.params.barcode;
    if (!rawBarcode || typeof rawBarcode !== 'string') {
      return res.status(400).json({ found: false, error: 'Valid barcode is required' });
    }
    const barcode = rawBarcode.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!barcode || barcode.length < 5 || barcode.length > 20) {
      return res.status(400).json({ found: false, error: 'Barcode format invalid (must be 5-20 characters)' });
    }

    const foods = await getFoods();
    const existing = foods.find(f => f.barcode === barcode);
    if (existing) {
      return res.json({
        found: true,
        source: 'local_cache',
        product: existing
      });
    }

    // Miss in local cache: fetch from Open Food Facts API
    try {
      const offUrl = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
      const offResponse = await fetch(offUrl, {
        headers: {
          'User-Agent': 'IronPulseWorkoutTracker/1.0 (contact@ironpulse.fit)'
        },
        signal: AbortSignal.timeout(4000)
      });

      if (offResponse.ok) {
        const offData = await offResponse.json();
        if (offData && offData.status === 1 && offData.product) {
          const p = offData.product;
          const nutriments = p.nutriments || {};

          const name = p.product_name || p.product_name_en || p.generic_name || `Scanned Item (${barcode})`;
          const brand = p.brands || 'Open Food Facts';
          const imageUrl = p.image_front_small_url || p.image_url || undefined;
          const servingSize = p.serving_size || '100g';

          const calories = Math.round(Number(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : 0)) || 0);
          const protein = Math.round((Number(nutriments.proteins_100g || nutriments.proteins || 0)) * 10) / 10;
          const carbs = Math.round((Number(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0)) * 10) / 10;
          const fat = Math.round((Number(nutriments.fat_100g || nutriments.fat || 0)) * 10) / 10;

          const isOrganic = Array.isArray(p.labels_tags) && p.labels_tags.some(tag => tag.includes('organic'));
          const novaGroup = [1, 2, 3, 4].includes(p.nova_group) ? p.nova_group : (isOrganic ? 1 : 2);

          // Parse additives
          const additivesTags = Array.isArray(p.additives_tags) ? p.additives_tags : [];
          const resolvedAdditives = additivesTags.map(tag => {
            const cleanCode = tag.replace(/^en:/, '').toLowerCase();
            const matched = ADDITIVES_DATABASE[cleanCode];
            if (matched) return matched;
            return {
              code: cleanCode.toUpperCase(),
              name: cleanCode.toUpperCase(),
              risk: 'Low',
              description: 'Food additive recorded in Open Food Facts'
            };
          });

          const { score, rating } = calculateYukaScore(p.nutriscore_grade, resolvedAdditives, isOrganic, calories, protein);

          const newFood = {
            id: 'food-off-' + barcode,
            name: name.trim(),
            brand: brand.trim(),
            barcode,
            imageUrl,
            calories,
            protein,
            carbs,
            fat,
            servingSize,
            yukaScore: score,
            yukaRating: rating,
            additives: resolvedAdditives,
            novaGroup,
            isOrganic
          };

          // Cache in foods list for instant future lookup
          foods.unshift(newFood);
          await saveFoods(foods);

          return res.json({
            found: true,
            source: 'open_food_facts',
            product: newFood
          });
        }
      }
    } catch (fetchErr) {
      console.warn('Open Food Facts API fetch timeout or error:', fetchErr.message);
    }

    return res.status(404).json({
      found: false,
      error: `Food product with barcode ${barcode} not found in Open Food Facts or local database.`
    });
  } catch (err) {
    console.error('Barcode lookup error:', err);
    res.status(500).json({ found: false, error: 'Internal error during barcode lookup' });
  }
};

app.get('/api/v1/foods/barcode/:barcode', handleBarcodeLookup);
app.get('/api/foods/barcode/:barcode', handleBarcodeLookup);

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

// 11. Two-Pass AI Workout Natural Language Parser & Catalog Grounding
function trigramSimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const s2 = (str2 || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.90;

  const getTrigrams = (str) => {
    const padded = `  ${str} `;
    const trigrams = new Set();
    for (let i = 0; i < padded.length - 2; i++) {
      trigrams.add(padded.slice(i, i + 3));
    }
    return trigrams;
  };

  const t1 = getTrigrams(s1);
  const t2 = getTrigrams(s2);

  let intersection = 0;
  for (const t of t1) {
    if (t2.has(t)) intersection++;
  }

  const union = t1.size + t2.size - intersection;
  return union === 0 ? 0 : Number((intersection / union).toFixed(2));
}

function resolveCatalogMatch(rawName, catalog) {
  const scored = catalog.map(cat => ({
    catalogId: cat.id,
    name: cat.name,
    muscleGroup: cat.muscleGroup,
    confidenceScore: trigramSimilarity(rawName, cat.name),
  })).sort((a, b) => b.confidenceScore - a.confidenceScore);

  const best = scored[0] || null;
  const isHighConfidence = best && best.confidenceScore >= 0.85;

  return {
    matchedCatalogId: best ? best.catalogId : undefined,
    matchedCatalogName: best ? best.name : undefined,
    confidenceScore: best ? best.confidenceScore : 0.5,
    needsUserConfirmation: !isHighConfidence,
    suggestedCandidates: scored.slice(0, 3)
  };
}

function parseNaturalLanguageWorkout(rawTranscript, catalog) {
  const statements = rawTranscript
    .split(/(?:\r?\n|,|\bthen\b|\band\b|;)+/i)
    .map(s => s.trim())
    .filter(Boolean);

  const parsedExercises = [];

  for (const statement of statements) {
    const setsRepsMatch = statement.match(/(\d+)\s*(?:sets?(?:\s*of|\s*x)?)\s*(\d+)?/i) || statement.match(/(\d+)\s*x\s*(\d+)/i);
    const weightMatch = statement.match(/(?:at|with|@)?\s*(\d+(?:\.\d+)?)\s*(?:kg|lbs?|pounds?)/i);

    let rawName = statement;
    let setCount = 3;
    let reps = 10;
    let weightKg = undefined;
    let distanceMeters = undefined;
    let durationSeconds = undefined;
    let metrics = undefined;

    if (/row(?:ed)?/i.test(statement)) {
      rawName = 'Concept2 Rowing Ergometer';
      const mMatch = statement.match(/(\d+)\s*m/i);
      if (mMatch) distanceMeters = parseInt(mMatch[1], 10);
      const timeMatch = statement.match(/(\d+):(\d+)/);
      if (timeMatch) {
        durationSeconds = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
      }
      setCount = 1;
      metrics = {
        damperSetting: 5,
        split500mPace: durationSeconds && distanceMeters ? `${Math.floor((durationSeconds / (distanceMeters / 500)) / 60)}:${Math.floor((durationSeconds / (distanceMeters / 500)) % 60).toString().padStart(2, '0')}` : '1:50.0'
      };
    } else if (/wall\s*balls?/i.test(statement)) {
      rawName = 'Wall Balls';
      metrics = { resistanceLevel: 20 };
    } else if (/bench(?:\s*press)?/i.test(statement)) {
      rawName = 'Barbell Flat Bench Press';
    } else if (/squat/i.test(statement)) {
      rawName = 'Barbell Back Squat';
    } else if (/deadlift/i.test(statement)) {
      rawName = 'Conventional Barbell Deadlift';
    } else if (/overhead\s*press|military/i.test(statement)) {
      rawName = 'Standing Overhead Press';
    } else if (/pull-?up/i.test(statement)) {
      rawName = 'Overhand Pull-Up';
    } else if (/curl/i.test(statement)) {
      rawName = 'Incline Dumbbell Bicep Curl';
    } else {
      rawName = statement
        .replace(/(\d+)\s*(?:sets?|x)\s*(\d+)?/gi, '')
        .replace(/(?:at|with|@)?\s*\d+(?:\.\d+)?\s*(?:kg|lbs?)/gi, '')
        .trim();
    }

    if (setsRepsMatch) {
      setCount = parseInt(setsRepsMatch[1], 10) || 3;
      if (setsRepsMatch[2]) reps = parseInt(setsRepsMatch[2], 10);
    }
    if (weightMatch) {
      let val = parseFloat(weightMatch[1]);
      if (/lbs?|pounds?/i.test(weightMatch[0])) val = Math.round(val * 0.453592 * 10) / 10;
      weightKg = val;
    }

    const grounded = resolveCatalogMatch(rawName, catalog);

    const sets = Array.from({ length: setCount }, (_, idx) => ({
      setIndex: idx + 1,
      reps,
      weightKg,
      distanceMeters,
      durationSeconds,
      metrics
    }));

    parsedExercises.push({
      rawInputString: statement,
      matchedCatalogId: grounded.matchedCatalogId,
      matchedCatalogName: grounded.matchedCatalogName,
      confidenceScore: grounded.confidenceScore,
      needsUserConfirmation: grounded.needsUserConfirmation,
      suggestedCandidates: grounded.suggestedCandidates,
      sets
    });
  }

  const overallConfidence = parsedExercises.length > 0
    ? Number((parsedExercises.reduce((acc, e) => acc + e.confidenceScore, 0) / parsedExercises.length).toFixed(2))
    : 0.9;

  return {
    extractedTitle: `Session: ${parsedExercises.map(e => e.matchedCatalogName || e.rawInputString).slice(0, 2).join(' + ')}`,
    exercises: parsedExercises,
    overallConfidence
  };
}

app.post('/api/v1/ai/parse-workout', async (req, res) => {
  try {
    const { rawTranscript } = req.body || {};
    if (!rawTranscript || typeof rawTranscript !== 'string' || rawTranscript.trim().length < 3) {
      return res.status(400).json({ error: 'Workout transcript too short' });
    }

    const catalog = await getCatalog();
    const result = parseNaturalLanguageWorkout(rawTranscript, catalog);
    res.json(result);
  } catch (err) {
    console.error('AI parse workout error:', err);
    res.status(500).json({ error: 'Failed to parse natural language workout' });
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
