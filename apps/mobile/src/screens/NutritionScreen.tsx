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
import { LoggedMeal, NutritionGoal } from '../types';

interface NutritionScreenProps {
  readonly meals: LoggedMeal[];
  readonly goals: NutritionGoal;
  readonly onAddMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  readonly onDeleteMeal?: (id: string) => void;
}

const MEAL_TYPES: Array<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'> = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
];

export const NutritionScreen: React.FC<NutritionScreenProps> = ({
  meals,
  goals,
  onAddMeal,
}) => {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [calories, setCalories] = useState('450');
  const [protein, setProtein] = useState('35');
  const [carbs, setCarbs] = useState('50');
  const [fat, setFat] = useState('12');

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFat = meals.reduce((acc, m) => acc + m.fatGrams, 0);

  const remainingCalories = Math.max(0, goals.dailyCalories - totalCalories);

  const handleAdd = () => {
    if (!mealName.trim()) {
      Alert.alert('Required', 'Please enter a meal or food description.');
      return;
    }

    onAddMeal({
      name: mealName.trim(),
      mealType,
      calories: parseInt(calories, 10) || 0,
      proteinGrams: parseInt(protein, 10) || 0,
      carbsGrams: parseInt(carbs, 10) || 0,
      fatGrams: parseInt(fat, 10) || 0,
    });

    setMealName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NUTRITION & MACROS HUD</Text>
        <Text style={styles.headerSubtitle}>
          MyFitnessPal-calibrated energy & macronutrient targets
        </Text>
      </View>

      {/* Calorie Gauge Card */}
      <View style={styles.hudCard}>
        <View style={styles.calorieRow}>
          <View>
            <Text style={styles.calorieBigNumber}>{remainingCalories}</Text>
            <Text style={styles.calorieLabel}>CALORIES REMAINING</Text>
          </View>
          <View style={styles.budgetBox}>
            <Text style={styles.budgetLine}>Base Target: {goals.dailyCalories} kcal</Text>
            <Text style={styles.budgetLine}>Consumed: {totalCalories} kcal</Text>
          </View>
        </View>

        {/* Macro Bars */}
        <View style={styles.macrosContainer}>
          {/* Protein */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroTitle}>PROTEIN</Text>
              <Text style={[styles.macroValue, { color: theme.colors.protein }]}>
                {totalProtein} / {goals.proteinGrams}g
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: theme.colors.protein,
                    width: `${Math.min(100, (totalProtein / goals.proteinGrams) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Carbs */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroTitle}>CARBS</Text>
              <Text style={[styles.macroValue, { color: theme.colors.carbs }]}>
                {totalCarbs} / {goals.carbsGrams}g
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: theme.colors.carbs,
                    width: `${Math.min(100, (totalCarbs / goals.carbsGrams) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Fats */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroTitle}>FATS</Text>
              <Text style={[styles.macroValue, { color: theme.colors.fats }]}>
                {totalFat} / {goals.fatGrams}g
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: theme.colors.fats,
                    width: `${Math.min(100, (totalFat / goals.fatGrams) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Log Food Card */}
      <View style={styles.addCard}>
        <Text style={styles.cardSectionLabel}>LOG MEAL // FOOD</Text>

        {/* Meal Type Chips */}
        <View style={styles.chipsRow}>
          {MEAL_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, mealType === t && styles.typeChipActive]}
              onPress={() => setMealType(t)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  mealType === t && styles.typeChipTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="e.g. Double Chicken Burrito Bowl"
          placeholderTextColor={theme.colors.textMuted}
          value={mealName}
          onChangeText={setMealName}
        />

        {/* Inputs Grid */}
        <View style={styles.inputsGrid}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>KCAL</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>PROTEIN (G)</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>CARBS (G)</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>FAT (G)</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={fat}
              onChangeText={setFat}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ LOG FOOD ENTRY</Text>
        </TouchableOpacity>
      </View>

      {/* Logged Meals List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>TODAY'S LOGGED FOODS ({meals.length})</Text>
      </View>

      {meals.map((m) => (
        <View key={m.id} style={styles.mealCard}>
          <View style={styles.mealCardTop}>
            <Text style={styles.mealName}>{m.name}</Text>
            <Text style={styles.mealCalories}>{m.calories} kcal</Text>
          </View>
          <View style={styles.mealMetaRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{m.mealType}</Text>
            </View>
            <Text style={styles.macroSummaryText}>
              P: {m.proteinGrams}g | C: {m.carbsGrams}g | F: {m.fatGrams}g
            </Text>
          </View>
        </View>
      ))}
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
  hudCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  calorieBigNumber: {
    color: theme.colors.textPrimary,
    fontSize: 34,
    fontWeight: '900',
  },
  calorieLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  budgetBox: {
    alignItems: 'flex-end',
  },
  budgetLine: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  macrosContainer: {
    gap: 12,
  },
  macroItem: {},
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroTitle: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  macroValue: {
    fontSize: 11,
    fontWeight: '800',
  },
  track: {
    height: 6,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xs,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.borderRadius.xs,
  },
  addCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
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
    marginBottom: theme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  typeChip: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeChipText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
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
    marginBottom: theme.spacing.md,
  },
  inputsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    color: theme.colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  smallInput: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.textPrimary,
    paddingHorizontal: 4,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 14,
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
  mealCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  mealCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  mealCalories: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  mealMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
  },
  typeBadgeText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  macroSummaryText: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
});
