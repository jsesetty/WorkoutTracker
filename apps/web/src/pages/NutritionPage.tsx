import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import {
  CalorieHudCard,
  CalorieMathGrid,
  CaloriePod,
  MealSectionPaper,
  MealRowItem,
  CleanSwapCard,
} from '../components/styled';
import { MacroProgressBar } from '../components/MacroProgressBar';
import { YukaScoreBadge } from '../components/YukaScoreBadge';
import {
  LoggedMeal,
  NutritionGoals,
  FoodItem,
  MealCategory,
  YukaRating,
} from '../types/nutrition';
import { storage } from '../services/storageFallback';
import { isStaticHost, getApiUrl } from '../services/apiConfig';

interface NutritionPageProps {
  readonly workoutBurnedCalories?: number;
}

const MEAL_CATEGORIES: readonly MealCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
];

export const NutritionPage: React.FC<NutritionPageProps> = ({
  workoutBurnedCalories = 0,
}) => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [goals, setGoals] = useState<NutritionGoals>({
    calorieTarget: 2200,
    proteinTarget: 165,
    carbsTarget: 220,
    fatTarget: 60,
    waterTarget: 3000,
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('Breakfast');

  // Form states for adding meal
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('200');
  const [customProtein, setCustomProtein] = useState<string>('20');
  const [customCarbs, setCustomCarbs] = useState<string>('15');
  const [customFat, setCustomFat] = useState<string>('5');
  const [customServing, setCustomServing] = useState<string>('1 serving');

  // Notification state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Fetch initial data
  const fetchData = useCallback(async () => {
    if (isStaticHost()) {
      setMeals(storage.getMeals());
      setGoals(storage.getGoals());
      setFoods(storage.getFoods());
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [mealsRes, goalsRes, foodsRes] = await Promise.all([
        fetch(getApiUrl('/api/meals')),
        fetch(getApiUrl('/api/nutrition-goals')),
        fetch(getApiUrl('/api/foods')),
      ]);

      if (mealsRes.ok) {
        const mealsData: LoggedMeal[] = await mealsRes.json();
        setMeals(mealsData);
        storage.saveMeals(mealsData);
      } else {
        setMeals(storage.getMeals());
      }
      if (goalsRes.ok) {
        const goalsData: NutritionGoals = await goalsRes.json();
        setGoals(goalsData);
      } else {
        setGoals(storage.getGoals());
      }
      if (foodsRes.ok) {
        const foodsData: FoodItem[] = await foodsRes.json();
        setFoods(foodsData);
        storage.saveFoods(foodsData);
      } else {
        setFoods(storage.getFoods());
      }
    } catch {
      // Use offline storage on static hosting
      setMeals(storage.getMeals());
      setGoals(storage.getGoals());
      setFoods(storage.getFoods());
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync meals to local storage on change
  useEffect(() => {
    if (meals.length > 0) {
      storage.saveMeals(meals);
    }
  }, [meals]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Daily totals
  const totalConsumed = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const remainingCalories = useMemo(() => {
    return goals.calorieTarget - totalConsumed.calories + workoutBurnedCalories;
  }, [goals.calorieTarget, totalConsumed.calories, workoutBurnedCalories]);

  const hasLowYukaMeals = useMemo(() => {
    return meals.some((meal) => meal.yukaScore < 50);
  }, [meals]);

  // Open Log Food Dialog
  const handleOpenAddDialog = (category: MealCategory) => {
    setSelectedCategory(category);
    setSelectedFoodId('');
    setCustomName('');
    setCustomCalories('200');
    setCustomProtein('20');
    setCustomCarbs('15');
    setCustomFat('5');
    setCustomServing('1 serving');
    setDialogOpen(true);
  };

  // Add meal submit
  const handleAddMealSubmit = async () => {
    let payloadName = customName.trim();
    let payloadCalories = Number(customCalories) || 0;
    let payloadProtein = Number(customProtein) || 0;
    let payloadCarbs = Number(customCarbs) || 0;
    let payloadFat = Number(customFat) || 0;
    let payloadServing = customServing.trim() || '1 serving';
    let foodRefId: string | undefined = undefined;
    let yukaScore: number | undefined = undefined;
    let yukaRating: string | undefined = undefined;

    if (selectedFoodId) {
      const matched = foods.find((f) => f.id === selectedFoodId);
      if (matched) {
        payloadName = matched.name;
        payloadCalories = matched.calories;
        payloadProtein = matched.protein;
        payloadCarbs = matched.carbs;
        payloadFat = matched.fat;
        payloadServing = matched.servingSize;
        foodRefId = matched.id;
        yukaScore = matched.yukaScore;
        yukaRating = matched.yukaRating;
      }
    }

    if (!payloadName) {
      setSnackbar({
        open: true,
        message: 'Please provide a food name or pick from library',
        severity: 'error',
      });
      return;
    }

    const payload = {
      name: payloadName,
      category: selectedCategory,
      calories: payloadCalories,
      protein: payloadProtein,
      carbs: payloadCarbs,
      fat: payloadFat,
      servingSize: payloadServing,
      foodId: foodRefId,
      yukaScore,
      yukaRating,
    };

    if (isStaticHost()) {
      const offlineMeal: LoggedMeal = {
        id: `meal-local-${Date.now()}`,
        name: payload.name,
        category: payload.category,
        calories: payload.calories,
        protein: payload.protein,
        carbs: payload.carbs,
        fat: payload.fat,
        servingSize: payload.servingSize,
        createdAt: new Date().toISOString(),
        foodId: payload.foodId,
        yukaScore: payload.yukaScore ?? 85,
        yukaRating: (payload.yukaRating as YukaRating) || 'Good',
      };
      setMeals((prev) => [offlineMeal, ...prev]);
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Logged ${offlineMeal.name} to ${offlineMeal.category}!`,
        severity: 'success',
      });
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/meals'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to log meal');

      const savedMeal: LoggedMeal = await res.json();
      setMeals((prev) => [savedMeal, ...prev]);
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Logged ${savedMeal.name} to ${savedMeal.category}!`,
        severity: 'success',
      });
    } catch {
      // Static / offline fallback
      const offlineMeal: LoggedMeal = {
        id: `meal-local-${Date.now()}`,
        name: payload.name,
        category: payload.category,
        calories: payload.calories,
        protein: payload.protein,
        carbs: payload.carbs,
        fat: payload.fat,
        servingSize: payload.servingSize,
        createdAt: new Date().toISOString(),
        foodId: payload.foodId,
        yukaScore: payload.yukaScore ?? 85,
        yukaRating: (payload.yukaRating as YukaRating) || 'Good',
      };
      setMeals((prev) => [offlineMeal, ...prev]);
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Logged ${offlineMeal.name} to ${offlineMeal.category}!`,
        severity: 'success',
      });
    }
  };

  // Delete meal
  const handleDeleteMeal = async (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));

    if (isStaticHost()) {
      setSnackbar({
        open: true,
        message: 'Meal removed from daily diary',
        severity: 'info',
      });
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/api/meals/${id}`), { method: 'DELETE' });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, deletion saved locally:', err);
    }
    setSnackbar({
      open: true,
      message: 'Meal removed from daily diary',
      severity: 'info',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              color: 'text.primary',
            }}
          >
            Nutrition & Macro Diary
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            MyFitnessPal Caloric Budget HUD synced with Lyfta Exertion and Yuka Clean Food Scoring
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<RestaurantMenuIcon />}
          onClick={() => navigate('/food-intel')}
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            borderRadius: '4px',
          }}
        >
          Food Quality Intel
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Calorie Balance HUD (MyFitnessPal + Lyfta Synergy) */}
          <CalorieHudCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Daily Caloric Equation
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Remaining = Goal − Food + Workout
                </Typography>
              </Box>

              {workoutBurnedCalories > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '2px',
                    backgroundColor: 'rgba(5, 150, 105, 0.14)',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                  }}
                >
                  <FitnessCenterIcon sx={{ fontSize: '1rem', color: '#059669' }} />
                  <Typography
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#059669',
                    }}
                  >
                    +{workoutBurnedCalories} kcal from completed sets
                  </Typography>
                </Box>
              )}
            </Box>

            <CalorieMathGrid>
              <CaloriePod>
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  Target Goal
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'var(--font-telemetry)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'text.primary',
                  }}
                >
                  {goals.calorieTarget}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  kcal
                </Typography>
              </CaloriePod>

              <CaloriePod>
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  Food Consumed
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'var(--font-telemetry)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'text.primary',
                  }}
                >
                  − {totalConsumed.calories}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  kcal
                </Typography>
              </CaloriePod>

              <CaloriePod>
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  Workout Burned
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'var(--font-telemetry)',
                    fontVariantNumeric: 'tabular-nums',
                    color: workoutBurnedCalories > 0 ? '#059669' : 'text.primary',
                  }}
                >
                  + {workoutBurnedCalories}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  kcal (Lyfta sets)
                </Typography>
              </CaloriePod>

              <CaloriePod highlight>
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#059669',
                    textTransform: 'uppercase',
                  }}
                >
                  Net Remaining
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'var(--font-telemetry)',
                    fontVariantNumeric: 'tabular-nums',
                    color: remainingCalories >= 0 ? '#059669' : '#EF4444',
                  }}
                >
                  {remainingCalories}
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                  kcal left
                </Typography>
              </CaloriePod>
            </CalorieMathGrid>

            {/* Macro Targets Progress Meters */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
              <MacroProgressBar
                label="Protein (Muscle Synthesis)"
                current={totalConsumed.protein}
                target={goals.proteinTarget}
                color="#FF5500"
              />
              <MacroProgressBar
                label="Carbohydrates (Glycogen)"
                current={totalConsumed.carbs}
                target={goals.carbsTarget}
                color="#00D8F6"
              />
              <MacroProgressBar
                label="Fats (Hormonal Balance)"
                current={totalConsumed.fat}
                target={goals.fatTarget}
                color="#EAB308"
              />
            </Box>
          </CalorieHudCard>

          {/* Clean Swap Alert Banner (Yuka Synergy) */}
          {hasLowYukaMeals && (
            <CleanSwapCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  ⚠️ Some logged meals have low Yuka health ratings. Discover clean, nutrient-dense athletic swaps.
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/food-intel')}
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              >
                Inspect Clean Swaps
              </Button>
            </CleanSwapCard>
          )}

          {/* Categorized Meal Diary */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MEAL_CATEGORIES.map((category) => {
              const categoryMeals = meals.filter((m) => m.category === category);
              const categoryCalories = categoryMeals.reduce((acc, m) => acc + m.calories, 0);

              return (
                <MealSectionPaper key={category}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          color: 'text.primary',
                        }}
                      >
                        {category}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'text.secondary',
                        }}
                      >
                        {categoryCalories} kcal
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenAddDialog(category)}
                      sx={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: '2px',
                      }}
                    >
                      Log Food
                    </Button>
                  </Box>

                  {categoryMeals.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        py: 1,
                      }}
                    >
                      No foods logged for {category.toLowerCase()} yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {categoryMeals.map((meal) => (
                        <MealRowItem key={meal.id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: '0.92rem',
                                color: 'text.primary',
                              }}
                            >
                              {meal.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '0.74rem',
                                color: 'text.secondary',
                              }}
                            >
                              {meal.servingSize || '1 serving'} • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography
                              sx={{
                                fontFamily: 'var(--font-telemetry)',
                                fontVariantNumeric: 'tabular-nums',
                                fontSize: '0.95rem',
                                fontWeight: 800,
                                color: 'text.primary',
                              }}
                            >
                              {meal.calories} kcal
                            </Typography>

                            <YukaScoreBadge score={meal.yukaScore} rating={meal.yukaRating} />

                            <IconButton
                              size="small"
                              onClick={() => handleDeleteMeal(meal.id)}
                              aria-label={`Delete ${meal.name}`}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': { color: '#EF4444' },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </MealRowItem>
                      ))}
                    </Box>
                  )}
                </MealSectionPaper>
              );
            })}
          </Box>
        </>
      )}

      {/* Add / Log Food Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '4px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Log Food to {selectedCategory}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            select
            fullWidth
            label="Pick from Verified Food Directory (Yuka Rated)"
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            helperText="Auto-fills calories, macro splits, and verified Yuka quality ratings"
          >
            <MenuItem value="">
              <em>-- Custom Food Entry --</em>
            </MenuItem>
            {foods.map((food) => (
              <MenuItem key={food.id} value={food.id}>
                {food.name} ({food.calories} kcal • Yuka: {food.yukaScore}/100)
              </MenuItem>
            ))}
          </TextField>

          {!selectedFoodId && (
            <>
              <TextField
                fullWidth
                label="Food Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Grilled Flank Steak"
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                <TextField
                  label="Calories (kcal)"
                  type="number"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                />
                <TextField
                  label="Serving Size"
                  value={customServing}
                  onChange={(e) => setCustomServing(e.target.value)}
                />
                <TextField
                  label="Protein (g)"
                  type="number"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                />
                <TextField
                  label="Carbs (g)"
                  type="number"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                />
                <TextField
                  label="Fat (g)"
                  type="number"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value)}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMealSubmit}
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
            }}
          >
            Add to Diary
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
