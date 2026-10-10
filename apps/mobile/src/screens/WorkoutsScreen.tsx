import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { WorkoutItem, MuscleGroup } from '../types';

interface WorkoutsScreenProps {
  readonly workouts: WorkoutItem[];
  readonly onAddWorkout: (workout: Omit<WorkoutItem, 'id' | 'createdAt'>) => void;
  readonly onToggleWorkout: (id: string) => void;
  readonly onDeleteWorkout: (id: string) => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
];

const QUICK_PRESETS = [
  { title: 'Bench Press', muscle: 'Chest' as MuscleGroup, weight: 80, reps: 8 },
  { title: 'Barbell Squat', muscle: 'Legs' as MuscleGroup, weight: 100, reps: 6 },
  { title: 'Deadlift', muscle: 'Back' as MuscleGroup, weight: 140, reps: 5 },
  { title: 'Overhead Press', muscle: 'Shoulders' as MuscleGroup, weight: 50, reps: 8 },
  { title: 'Pull-Ups', muscle: 'Back' as MuscleGroup, weight: 0, reps: 10 },
];

export const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({
  workouts,
  onAddWorkout,
  onToggleWorkout,
  onDeleteWorkout,
}) => {
  const [title, setTitle] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('Chest');
  const [weightKg, setWeightKg] = useState('60');
  const [reps, setReps] = useState('10');
  const [setsCount, setSetsCount] = useState('3');

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter an exercise title.');
      return;
    }

    const targetSets = parseInt(setsCount, 10) || 3;
    const targetReps = parseInt(reps, 10) || 10;
    const targetWeightKg = parseFloat(weightKg) || 0;

    const workingSets = Array.from({ length: targetSets }, (_, i) => ({
      id: `s-${Date.now()}-${i}`,
      setNumber: i + 1,
      weightKg: targetWeightKg,
      reps: targetReps,
      completed: false,
    }));

    onAddWorkout({
      title: title.trim(),
      muscleGroup: selectedMuscle,
      completed: false,
      sets: workingSets,
      targetSets,
      targetReps,
      targetWeightKg,
    });

    setTitle('');
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setTitle(preset.title);
    setSelectedMuscle(preset.muscle);
    setWeightKg(String(preset.weight));
    setReps(String(preset.reps));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ACTIVE TRAINING SESSION</Text>
        <Text style={styles.headerSubtitle}>
          Log movements, working sets, and reps
        </Text>
      </View>

      {/* Add Exercise Card */}
      <View style={styles.addCard}>
        <Text style={styles.cardSectionLabel}>NEW MOVEMENT</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Incline Dumbbell Press"
          placeholderTextColor={theme.colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        {/* Quick Presets */}
        <Text style={styles.subLabel}>QUICK PRESETS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
          {QUICK_PRESETS.map((p) => (
            <TouchableOpacity
              key={p.title}
              style={styles.presetChip}
              onPress={() => applyPreset(p)}
            >
              <Text style={styles.presetChipText}>{p.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Muscle Selector */}
        <Text style={styles.subLabel}>TARGET MUSCLE GROUP</Text>
        <View style={styles.muscleRow}>
          {MUSCLE_GROUPS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.muscleChip,
                selectedMuscle === m && styles.muscleChipActive,
              ]}
              onPress={() => setSelectedMuscle(m)}
            >
              <Text
                style={[
                  styles.muscleChipText,
                  selectedMuscle === m && styles.muscleChipTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics Grid */}
        <View style={styles.inputsGrid}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>SETS</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={setsCount}
              onChangeText={setSetsCount}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>REPS</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={weightKg}
              onChangeText={setWeightKg}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ LOG EXERCISE</Text>
        </TouchableOpacity>
      </View>

      {/* Exercises List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>LOGGED EXERCISES ({workouts.length})</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exercises logged in active session.</Text>
          <Text style={styles.emptySubtext}>Use presets above to start training.</Text>
        </View>
      ) : (
        workouts.map((w) => (
          <View
            key={w.id}
            style={[styles.workoutCard, w.completed && styles.workoutCardCompleted]}
          >
            <View style={styles.workoutCardHeader}>
              <View style={styles.titleArea}>
                <Text
                  style={[
                    styles.workoutTitle,
                    w.completed && styles.workoutTitleCompleted,
                  ]}
                >
                  {w.title}
                </Text>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{w.muscleGroup}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  w.completed && styles.toggleBtnCompleted,
                ]}
                onPress={() => onToggleWorkout(w.id)}
              >
                <Text style={styles.toggleBtnText}>
                  {w.completed ? '✓ DONE' : 'MARK'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Target Spec Badge */}
            <View style={styles.specRow}>
              <Text style={styles.specText}>
                {w.targetSets} sets × {w.targetReps} reps @ {w.targetWeightKg} kg
              </Text>
              <TouchableOpacity onPress={() => onDeleteWorkout(w.id)}>
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
  header: {
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  addCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  cardSectionLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.sm,
  },
  subLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: theme.spacing.xs,
    marginBottom: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  presetChip: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  presetChipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  muscleChip: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  muscleChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  muscleChipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  muscleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  inputsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    color: theme.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 13,
  },
  listHeader: {
    marginBottom: theme.spacing.sm,
  },
  listTitle: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  workoutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  workoutCardCompleted: {
    opacity: 0.6,
    borderColor: theme.colors.success,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  workoutTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  tagBadge: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagBadgeText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  toggleBtn: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  toggleBtnCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  toggleBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  specText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  deleteText: {
    color: theme.colors.error,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  emptySubtext: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
