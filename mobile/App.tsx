import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { theme } from './src/theme';
import { api } from './src/services/api';
import { WorkoutItem, LoggedMeal, NutritionGoal } from './src/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { NutritionScreen } from './src/screens/NutritionScreen';

type TabType = 'home' | 'workouts' | 'nutrition';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [goals, setGoals] = useState<NutritionGoal>({
    dailyCalories: 2600,
    proteinGrams: 180,
    carbsGrams: 280,
    fatGrams: 65,
  });

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const [fetchedWorkouts, fetchedMeals, fetchedGoals] = await Promise.all([
        api.getWorkouts(),
        api.getMeals(),
        api.getNutritionGoals(),
      ]);
      if (isMounted) {
        setWorkouts(fetchedWorkouts);
        setMeals(fetchedMeals);
        setGoals(fetchedGoals);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Workout Actions
  const handleAddWorkout = async (item: Omit<WorkoutItem, 'id' | 'createdAt'>) => {
    const created = await api.addWorkout(item);
    setWorkouts((prev) => [created, ...prev]);
  };

  const handleToggleWorkout = async (id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
    await api.toggleWorkout(id);
  };

  const handleDeleteWorkout = async (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    await api.deleteWorkout(id);
  };

  // Nutrition Actions
  const handleAddMeal = async (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const created = await api.addMeal(meal);
    setMeals((prev) => [created, ...prev]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Top Athletic Branding Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandTitle}>IRONPULSE</Text>
          <Text style={styles.brandTag}>MOBILE // V1.0</Text>
        </View>
        <View style={styles.syncStatus}>
          <View style={styles.syncDot} />
          <Text style={styles.syncText}>SYNCED</Text>
        </View>
      </View>

      {/* Screen Container */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            workouts={workouts}
            meals={meals}
            goals={goals}
            onNavigate={(screen) => setActiveTab(screen)}
          />
        )}
        {activeTab === 'workouts' && (
          <WorkoutsScreen
            workouts={workouts}
            onAddWorkout={handleAddWorkout}
            onToggleWorkout={handleToggleWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />
        )}
        {activeTab === 'nutrition' && (
          <NutritionScreen
            meals={meals}
            goals={goals}
            onAddMeal={handleAddMeal}
          />
        )}
      </View>

      {/* Bottom Tab Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>
            🏠
          </Text>
          <Text
            style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}
          >
            HUD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'workouts' && styles.tabButtonActive]}
          onPress={() => setActiveTab('workouts')}
        >
          <Text
            style={[styles.tabIcon, activeTab === 'workouts' && styles.tabIconActive]}
          >
            ⚡
          </Text>
          <Text
            style={[styles.tabLabel, activeTab === 'workouts' && styles.tabLabelActive]}
          >
            WORKOUTS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'nutrition' && styles.tabButtonActive]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Text
            style={[styles.tabIcon, activeTab === 'nutrition' && styles.tabIconActive]}
          >
            🥗
          </Text>
          <Text
            style={[styles.tabLabel, activeTab === 'nutrition' && styles.tabLabelActive]}
          >
            DIET
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  brandTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  brandTag: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  syncText: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.surfaceElevated,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: theme.colors.primary,
  },
});
