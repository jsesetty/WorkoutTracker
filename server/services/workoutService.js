import { getWorkouts, saveWorkouts } from '../storage/jsonStorage.js';

const VALID_MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];

export class WorkoutService {
  /**
   * Retrieve all workouts
   */
  async getAllWorkouts() {
    return await getWorkouts();
  }

  /**
   * Create a new workout
   */
  async createWorkout(data) {
    const { title, muscleGroup, intensity, priority, sets, reps, weight, notes, setDetails } = data;

    if (!title || typeof title !== 'string' || !title.trim()) {
      const error = new Error('Exercise title is required');
      error.status = 400;
      throw error;
    }

    const resolvedMuscleGroup = VALID_MUSCLE_GROUPS.includes(muscleGroup) ? muscleGroup : 'Chest';
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
    return newWorkout;
  }

  /**
   * Update or toggle an existing workout (with offline upsert support)
   */
  async updateWorkout(id, data) {
    const { title, completed, intensity, priority, muscleGroup, sets, reps, weight, notes, setDetails } = data;
    const workouts = await getWorkouts();
    const index = workouts.findIndex(w => w.id === id);

    // Upsert fallback for offline clients with client UUID
    if (index === -1) {
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
      return newWorkout;
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
    return workouts[index];
  }

  /**
   * Delete a single workout
   */
  async deleteWorkout(id) {
    let workouts = await getWorkouts();
    const exists = workouts.some(w => w.id === id);

    if (!exists) {
      return null;
    }

    workouts = workouts.filter(w => w.id !== id);
    await saveWorkouts(workouts);
    return { success: true, id };
  }

  /**
   * Clear all completed workouts
   */
  async clearCompletedWorkouts() {
    let workouts = await getWorkouts();
    const initialCount = workouts.length;
    workouts = workouts.filter(w => !w.completed);
    const removedCount = initialCount - workouts.length;
    await saveWorkouts(workouts);
    return { success: true, removedCount };
  }
}

export const workoutService = new WorkoutService();
