import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme';
import { WorkoutItem, LoggedMeal, NutritionGoal } from '../types';

interface HomeScreenProps {
  readonly workouts: WorkoutItem[];
  readonly meals: LoggedMeal[];
  readonly goals: NutritionGoal;
  readonly onNavigate: (screen: 'home' | 'workouts' | 'nutrition') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  workouts,
  meals,
  goals,
  onNavigate,
}) => {
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const totalSets = workouts.reduce(
    (acc, w) => acc + (w.sets ? w.sets.filter((s) => s.completed).length : 0),
    0
  );

  const consumedCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = meals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const remainingCalories = Math.max(0, goals.dailyCalories - consumedCalories);

  const caloriePct = Math.min(100, Math.round((consumedCalories / goals.dailyCalories) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand & HUD Badge */}
      <View style={styles.heroCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>SESSION HUD // ACTIVE</Text>
          <View style={styles.statusDot} />
        </View>
        <Text style={styles.brandTitle}>IRONPULSE</Text>
        <Text style={styles.heroSubtitle}>Training Session & Macro Engine</Text>

        {/* Intensity Progress Meter */}
        <View style={styles.meterContainer}>
          <View style={styles.meterHeader}>
            <Text style={styles.meterLabel}>WORKOUT COMPLETION</Text>
            <Text style={styles.meterValue}>
              {completedWorkouts} / {workouts.length} EXERCISES
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${workouts.length > 0 ? (completedWorkouts / workouts.length) * 100 : 0}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Quick Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedWorkouts}</Text>
          <Text style={styles.statTitle}>COMPLETED</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalSets}</Text>
          <Text style={styles.statTitle}>SETS LOGGED</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
            {consumedProtein}g
          </Text>
          <Text style={styles.statTitle}>PROTEIN</Text>
        </View>
      </View>

      {/* Nutrition Quick Glance */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DAILY ENERGY BUDGET</Text>
          <TouchableOpacity onPress={() => onNavigate('nutrition')}>
            <Text style={styles.actionText}>VIEW DIET →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calorieRow}>
          <View>
            <Text style={styles.calorieRemainingNumber}>{remainingCalories}</Text>
            <Text style={styles.calorieRemainingLabel}>KCAL REMAINING</Text>
          </View>
          <View style={styles.calorieConsumedBox}>
            <Text style={styles.consumedNumber}>{consumedCalories} / {goals.dailyCalories}</Text>
            <Text style={styles.calorieRemainingLabel}>{caloriePct}% REACHED</Text>
          </View>
        </View>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${caloriePct}%`,
                backgroundColor: theme.colors.secondary,
              },
            ]}
          />
        </View>
      </View>

      {/* Quick Launch Buttons */}
      <View style={styles.launchRow}>
        <TouchableOpacity
          style={[styles.launchButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => onNavigate('workouts')}
        >
          <Text style={styles.launchButtonText}>⚡ LOG EXERCISE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.launchButton, styles.secondaryLaunchButton]}
          onPress={() => onNavigate('nutrition')}
        >
          <Text style={styles.secondaryButtonText}>🥗 LOG MEAL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
    marginLeft: theme.spacing.sm,
  },
  brandTitle: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  meterContainer: {
    marginTop: theme.spacing.sm,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  meterLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  meterValue: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  statNumber: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  statTitle: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionText: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  calorieRemainingNumber: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
  },
  calorieRemainingLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  calorieConsumedBox: {
    alignItems: 'flex-end',
  },
  consumedNumber: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  launchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  launchButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLaunchButton: {
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  launchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
