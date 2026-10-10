import {
  getMeals,
  saveMeals,
  getFoods,
  saveFoods,
  getNutritionGoals,
  saveNutritionGoals
} from '../storage/jsonStorage.js';

export class NutritionService {
  /**
   * Retrieve all logged meals
   */
  async getMeals() {
    return await getMeals();
  }

  /**
   * Create a new meal record
   */
  async createMeal(data) {
    const { name, category, calories, protein, carbs, fat, foodId, yukaScore, yukaRating, servingSize } = data;

    if (!name || typeof name !== 'string' || !name.trim()) {
      const error = new Error('Meal name is required');
      error.status = 400;
      throw error;
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
    return newMeal;
  }

  /**
   * Delete a meal record
   */
  async deleteMeal(id) {
    let meals = await getMeals();
    meals = meals.filter(m => m.id !== id);
    await saveMeals(meals);
    return { success: true, id };
  }

  /**
   * Retrieve all custom/cached foods
   */
  async getFoods() {
    return await getFoods();
  }

  /**
   * Save a newly defined food item
   */
  async createFood(data) {
    const { name, brand, calories, protein, carbs, fat, servingSize, isOrganic, novaGroup, additives } = data;

    if (!name || typeof name !== 'string' || !name.trim()) {
      const error = new Error('Food name is required');
      error.status = 400;
      throw error;
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
    return newFood;
  }

  /**
   * Retrieve nutrition targets/goals
   */
  async getNutritionGoals() {
    return await getNutritionGoals();
  }

  /**
   * Update nutrition targets/goals
   */
  async updateNutritionGoals(data) {
    const goals = await getNutritionGoals();
    const updated = { ...goals, ...data };
    await saveNutritionGoals(updated);
    return updated;
  }
}

export const nutritionService = new NutritionService();
