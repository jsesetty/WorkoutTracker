import { Router } from 'express';
import { nutritionService } from '../services/nutritionService.js';

const router = Router();

// 1. Meals Endpoints
router.get('/meals', async (req, res, next) => {
  try {
    const meals = await nutritionService.getMeals();
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

router.post('/meals', async (req, res, next) => {
  try {
    const newMeal = await nutritionService.createMeal(req.body);
    res.status(201).json(newMeal);
  } catch (err) {
    next(err);
  }
});

router.delete('/meals/:id', async (req, res, next) => {
  try {
    const result = await nutritionService.deleteMeal(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 2. Foods Endpoints
router.get('/foods', async (req, res, next) => {
  try {
    const foods = await nutritionService.getFoods();
    res.json(foods);
  } catch (err) {
    next(err);
  }
});

router.post('/foods', async (req, res, next) => {
  try {
    const newFood = await nutritionService.createFood(req.body);
    res.status(201).json(newFood);
  } catch (err) {
    next(err);
  }
});

// 3. Nutrition Goals Endpoints
router.get('/nutrition-goals', async (req, res, next) => {
  try {
    const goals = await nutritionService.getNutritionGoals();
    res.json(goals);
  } catch (err) {
    next(err);
  }
});

router.put('/nutrition-goals', async (req, res, next) => {
  try {
    const updatedGoals = await nutritionService.updateNutritionGoals(req.body);
    res.json(updatedGoals);
  } catch (err) {
    next(err);
  }
});

export default router;
