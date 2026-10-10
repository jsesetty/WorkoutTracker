import React, { useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
} from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { getGymTheme } from './theme';
import { Header } from './components/Header';
import { AppShell } from './components/styled';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NutritionPage } from './pages/NutritionPage';
import { FoodScannerPage } from './pages/FoodScannerPage';
import {
  WorkoutItem,
  WorkoutSet,
  MuscleGroup,
  IntensityLevel,
  FilterType,
  NotificationState,
} from './types/workout';
import { storage } from './services/storageFallback';
import { generateClientUUID } from './lib/offlineDb';
import { useWorkoutsSync } from './hooks/useWorkoutsSync';

export const App: React.FC = () => {
  const { enqueueMutation } = useWorkoutsSync();
  // Theme State
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ironpulse-theme') || localStorage.getItem('dbz-tracker-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const theme = useMemo(() => getGymTheme(mode), [mode]);

  const handleToggleTheme = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem('ironpulse-theme', nextMode);
  };

  // Workout & Filter State
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);

  // Snackbar Notification State
  const [snackbar, setSnackbar] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // Initial Data Fetch
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch('/api/workouts');
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        setWorkouts(data);
        storage.saveWorkouts(data);
      } catch (err) {
        console.warn('Backend API unavailable, using offline storage:', err);
        const fallback = storage.getWorkouts();
        setWorkouts(fallback);
      }
    };
    fetchWorkouts();
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    if (workouts.length > 0) {
      storage.saveWorkouts(workouts);
    }
  }, [workouts]);

  // Add Workout Handler
  const handleAddWorkout = async (
    title: string,
    muscleGroup: MuscleGroup = 'Chest',
    intensity: IntensityLevel = 'medium',
    sets: number = 3,
    reps: number | string = 10,
    weight: string = ''
  ) => {
    const tempId = generateClientUUID();
    const parsedReps = typeof reps === 'number' ? reps : parseInt(String(reps), 10) || 10;
    const initialSets: WorkoutSet[] = Array.from({ length: sets }, (_, idx) => ({
      id: generateClientUUID(),
      setNumber: idx + 1,
      reps: parsedReps,
      weight: weight || '',
      completed: false,
    }));

    const optimisticWorkout: WorkoutItem = {
      id: tempId,
      title,
      muscleGroup,
      intensity,
      sets,
      reps,
      weight,
      setDetails: initialSets,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setWorkouts((prev) => [optimisticWorkout, ...prev]);
    enqueueMutation('exercise', tempId, 'UPSERT', optimisticWorkout);

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          muscleGroup,
          intensity,
          sets,
          reps,
          weight,
          setDetails: initialSets,
        }),
      });

      if (!res.ok) throw new Error('Add workout failed');
      const created = await res.json();

      setWorkouts((prev) => prev.map((w) => (w.id === tempId ? created : w)));
      showNotification('New exercise logged to active session! 💪', 'success');
    } catch {
      // Offline / GitHub Pages static fallback keeps the optimistic workout
      showNotification('New exercise logged to active session! 💪', 'success');
    }
  };

  // Toggle Workout Completion Handler
  const handleToggleWorkout = async (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (!workout) return;

    const nextCompleted = !workout.completed;
    const nextSets = (workout.setDetails || []).map((s) => ({
      ...s,
      completed: nextCompleted,
    }));

    const willBeAllDone =
      workouts.length > 0 &&
      workouts
        .map((w) => (w.id === id ? { ...w, completed: nextCompleted } : w))
        .every((w) => w.completed);

    const updatedWorkout: WorkoutItem = {
      ...workout,
      completed: nextCompleted,
      setDetails: nextSets.length > 0 ? nextSets : workout.setDetails,
    };
    enqueueMutation('exercise', id, 'UPSERT', updatedWorkout);

    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id
          ? updatedWorkout
          : w
      )
    );

    if (nextCompleted && willBeAllDone) {
      setConfettiTrigger(Date.now());
      showNotification('ALL EXERCISES CONQUERED! PHENOMENAL SESSION! 🔥', 'success');
    }

    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: nextCompleted,
          setDetails: nextSets.length > 0 ? nextSets : undefined,
        }),
      });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, state saved locally:', err);
    }
  };

  // Add Set Handler
  const handleAddSet = async (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) return;

    const currentSets = workout.setDetails || Array.from({ length: workout.sets || 3 }, (_, idx) => ({
      id: generateClientUUID(),
      setNumber: idx + 1,
      reps: typeof workout.reps === 'number' ? workout.reps : parseInt(String(workout.reps || 10), 10) || 10,
      completed: Boolean(workout.completed),
    }));

    const nextSetNumber = currentSets.length + 1;
    const defaultReps = currentSets.length > 0 ? currentSets[currentSets.length - 1].reps : 10;
    const newSet: WorkoutSet = {
      id: generateClientUUID(),
      setNumber: nextSetNumber,
      reps: defaultReps,
      completed: false,
    };

    const updatedSetDetails = [...currentSets, newSet];
    const updatedWorkout: WorkoutItem = {
      ...workout,
      sets: updatedSetDetails.length,
      setDetails: updatedSetDetails,
      completed: false,
    };
    enqueueMutation('exercise', workoutId, 'UPSERT', updatedWorkout);

    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? updatedWorkout
          : w
      )
    );

    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sets: updatedSetDetails.length,
          setDetails: updatedSetDetails,
          completed: false,
        }),
      });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, set saved locally:', err);
    }
    showNotification(`Added Set ${nextSetNumber} to ${workout.title}`, 'info');
  };

  // Update Set Handler
  const handleUpdateSet = async (
    workoutId: string,
    setId: string,
    updates: Partial<WorkoutSet>
  ) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) return;

    const currentSets = workout.setDetails || Array.from({ length: workout.sets || 3 }, (_, idx) => ({
      id: `${workout.id}-s-${idx + 1}`,
      setNumber: idx + 1,
      reps: typeof workout.reps === 'number' ? workout.reps : parseInt(String(workout.reps || 10), 10) || 10,
      completed: Boolean(workout.completed),
    }));

    const updatedSetDetails = currentSets.map((s) =>
      s.id === setId ? { ...s, ...updates } : s
    );

    const allSetsDone = updatedSetDetails.length > 0 && updatedSetDetails.every((s) => s.completed);

    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              completed: allSetsDone,
              setDetails: updatedSetDetails,
            }
          : w
      )
    );

    if (allSetsDone && !workout.completed) {
      setConfettiTrigger(Date.now());
      showNotification(`${workout.title} ALL SETS COMPLETED! 🔥`, 'success');
    }

    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setDetails: updatedSetDetails,
          completed: allSetsDone,
        }),
      });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, set saved locally:', err);
    }
  };

  // Delete Set Handler
  const handleDeleteSet = async (workoutId: string, setId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout || !workout.setDetails || workout.setDetails.length <= 1) return;

    const updatedSetDetails = workout.setDetails
      .filter((s) => s.id !== setId)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    const allSetsDone = updatedSetDetails.length > 0 && updatedSetDetails.every((s) => s.completed);

    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              sets: updatedSetDetails.length,
              completed: allSetsDone,
              setDetails: updatedSetDetails,
            }
          : w
      )
    );

    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sets: updatedSetDetails.length,
          setDetails: updatedSetDetails,
          completed: allSetsDone,
        }),
      });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, set removal saved locally:', err);
    }
    showNotification('Removed set from exercise', 'info');
  };

  // Update Title Handler
  const handleUpdateTitle = async (id: string, newTitle: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (!workout) return;

    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, title: newTitle } : w))
    );

    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, title saved locally:', err);
    }
    showNotification('Exercise details updated', 'info');
  };

  // Delete Workout Handler
  const handleDeleteWorkout = async (id: string) => {
    enqueueMutation('exercise', id, 'DELETE', { id });
    setWorkouts((prev) => prev.filter((w) => w.id !== id));

    try {
      const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, deletion saved locally:', err);
    }
    showNotification('Exercise removed from session', 'info');
  };

  // Clear Completed Handler
  const handleClearCompleted = async () => {
    const completedCount = workouts.filter((w) => w.completed).length;
    if (completedCount === 0) return;

    setWorkouts((prev) => prev.filter((w) => !w.completed));

    try {
      const res = await fetch('/api/workouts-completed', { method: 'DELETE' });
      if (!res.ok) console.warn('Server sync failed, keeping local state');
    } catch (err) {
      console.warn('API unavailable, clear saved locally:', err);
    }
    showNotification(
      `Cleared ${completedCount} finished exercise${completedCount > 1 ? 's' : ''}`,
      'info'
    );
  };

  // Filter Counts
  const counts = useMemo(() => {
    const all = workouts.length;
    const completed = workouts.filter((w) => w.completed).length;
    const active = all - completed;
    return { all, completed, active };
  }, [workouts]);

  // Workout Burned Calories Calculation (Lyfta Synergy)
  const workoutBurnedCalories = useMemo(() => {
    let burn = 0;
    for (const workout of workouts) {
      const sets = workout.setDetails || [];
      const intensityFactor =
        workout.intensity === 'high' ? 16 : workout.intensity === 'low' ? 8 : 12;

      for (const set of sets) {
        if (set.completed) {
          burn += intensityFactor;
        }
      }
    }
    return burn;
  }, [workouts]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppShell maxWidth="md">
        {/* Navigation Header */}
        <Header mode={mode} onToggleTheme={handleToggleTheme} />

        {/* Page Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                workouts={workouts}
                filter={filter}
                counts={counts}
                confettiTrigger={confettiTrigger}
                onAddWorkout={handleAddWorkout}
                onToggleWorkout={handleToggleWorkout}
                onUpdateTitle={handleUpdateTitle}
                onDeleteWorkout={handleDeleteWorkout}
                onFilterChange={setFilter}
                onClearCompleted={handleClearCompleted}
                onAddSet={handleAddSet}
                onUpdateSet={handleUpdateSet}
                onDeleteSet={handleDeleteSet}
                workoutBurnedCalories={workoutBurnedCalories}
              />
            }
          />
          <Route
            path="/nutrition"
            element={<NutritionPage workoutBurnedCalories={workoutBurnedCalories} />}
          />
          <Route path="/food-intel" element={<FoodScannerPage />} />
          <Route path="/history" element={<HistoryPage workouts={workouts} />} />
          <Route
            path="/exercises"
            element={
              <ExercisesPage
                onAddWorkout={handleAddWorkout}
                onShowNotification={showNotification}
              />
            }
          />
          <Route path="/analytics" element={<AnalyticsPage workouts={workouts} />} />
          <Route
            path="/settings"
            element={<SettingsPage mode={mode} onToggleTheme={handleToggleTheme} />}
          />
        </Routes>
      </AppShell>

      {/* Global Notification Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2800}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.03em',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
