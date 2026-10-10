import { Router } from 'express';
import { workoutService } from '../services/workoutService.js';

const router = Router();

// GET all workouts
const handleGetWorkouts = async (req, res, next) => {
  try {
    const workouts = await workoutService.getAllWorkouts();
    res.json(workouts);
  } catch (err) {
    next(err);
  }
};
router.get('/workouts', handleGetWorkouts);
router.get('/todos', handleGetWorkouts);

// POST create workout
const handleAddWorkout = async (req, res, next) => {
  try {
    const newWorkout = await workoutService.createWorkout(req.body);
    res.status(201).json(newWorkout);
  } catch (err) {
    next(err);
  }
};
router.post('/workouts', handleAddWorkout);
router.post('/todos', handleAddWorkout);

// PATCH update workout
const handleUpdateWorkout = async (req, res, next) => {
  try {
    const updated = await workoutService.updateWorkout(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
router.patch('/workouts/:id', handleUpdateWorkout);
router.patch('/todos/:id', handleUpdateWorkout);

// DELETE single workout
const handleDeleteWorkout = async (req, res, next) => {
  try {
    const result = await workoutService.deleteWorkout(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};
router.delete('/workouts/:id', handleDeleteWorkout);
router.delete('/todos/:id', handleDeleteWorkout);

// DELETE clear completed
const handleClearCompleted = async (req, res, next) => {
  try {
    const result = await workoutService.clearCompletedWorkouts();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
router.delete('/workouts-completed', handleClearCompleted);
router.delete('/todos-completed', handleClearCompleted);

export default router;
