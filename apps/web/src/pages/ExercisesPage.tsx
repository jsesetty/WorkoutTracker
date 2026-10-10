import React, { useState, useMemo } from 'react';
import { Box, Typography, Chip, Button, Tabs, Tab } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { ExerciseCatalogItem } from '@ironpulse/contracts';
import { ContentWrapper, SpecListItem } from '../components/styled';
import { MuscleGroup, IntensityLevel } from '../types/workout';

interface LibraryExercise {
  readonly name: string;
  readonly muscle: MuscleGroup;
  readonly intensity: IntensityLevel;
  readonly defaultSets: number;
  readonly targetReps: string;
}

function mapCatalogMuscle(m: string): MuscleGroup {
  const normalized = m.toUpperCase();
  if (normalized === 'CARDIO') return 'Cardio';
  if (normalized === 'FULL_BODY') return 'Full Body';
  if (normalized === 'CHEST') return 'Chest';
  if (normalized === 'BACK') return 'Back';
  if (normalized === 'LEGS') return 'Legs';
  if (normalized === 'SHOULDERS') return 'Shoulders';
  if (normalized === 'ARMS') return 'Arms';
  if (normalized === 'CORE') return 'Core';
  return 'Chest';
}

const EXERCISE_DIRECTORY: LibraryExercise[] = [
  // Chest
  { name: 'Barbell Flat Bench Press', muscle: 'Chest', intensity: 'high', defaultSets: 4, targetReps: '8-10' },
  { name: 'Incline Dumbbell Press', muscle: 'Chest', intensity: 'medium', defaultSets: 3, targetReps: '10-12' },
  { name: 'Cable Chest Flyes', muscle: 'Chest', intensity: 'low', defaultSets: 3, targetReps: '12-15' },
  // Back
  { name: 'Barbell Deadlifts', muscle: 'Back', intensity: 'high', defaultSets: 4, targetReps: '5-6' },
  { name: 'Wide-Grip Lat Pulldowns', muscle: 'Back', intensity: 'medium', defaultSets: 3, targetReps: '10-12' },
  { name: 'Seated Cable Row', muscle: 'Back', intensity: 'medium', defaultSets: 3, targetReps: '10-12' },
  // Legs
  { name: 'Barbell Back Squats', muscle: 'Legs', intensity: 'high', defaultSets: 4, targetReps: '6-8' },
  { name: 'Romanian Deadlifts', muscle: 'Legs', intensity: 'high', defaultSets: 3, targetReps: '8-10' },
  { name: 'Leg Extensions', muscle: 'Legs', intensity: 'low', defaultSets: 3, targetReps: '12-15' },
  // Shoulders
  { name: 'Standing Military Overhead Press', muscle: 'Shoulders', intensity: 'high', defaultSets: 4, targetReps: '8-10' },
  { name: 'Dumbbell Lateral Raises', muscle: 'Shoulders', intensity: 'low', defaultSets: 4, targetReps: '12-15' },
  // Arms
  { name: 'Barbell Bicep Curls', muscle: 'Arms', intensity: 'medium', defaultSets: 3, targetReps: '10-12' },
  { name: 'Tricep Rope Pushdowns', muscle: 'Arms', intensity: 'medium', defaultSets: 3, targetReps: '12-15' },
  // Core
  { name: 'Hanging Leg Raises', muscle: 'Core', intensity: 'low', defaultSets: 3, targetReps: '15' },
  { name: 'Cable Woodchoppers', muscle: 'Core', intensity: 'low', defaultSets: 3, targetReps: '12-15' },
];

interface ExercisesPageProps {
  readonly onAddWorkout: (
    title: string,
    muscleGroup: MuscleGroup,
    intensity: IntensityLevel,
    sets: number
  ) => void;
  readonly onShowNotification: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ExercisesPage: React.FC<ExercisesPageProps> = ({
  onAddWorkout,
  onShowNotification,
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('ALL');

  const { data: catalogData } = useQuery<ExerciseCatalogItem[]>({
    queryKey: ['exercise-catalog'],
    queryFn: async () => {
      const res = await fetch('/api/v1/catalog');
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 1000 * 60 * 15,
  });

  const allExercises = useMemo(() => {
    if (!catalogData || catalogData.length === 0) return EXERCISE_DIRECTORY;
    const catalogList: LibraryExercise[] = catalogData.map((item) => ({
      name: item.name,
      muscle: mapCatalogMuscle(item.muscleGroup),
      intensity: (item.muscleGroup === 'CARDIO' || item.muscleGroup === 'FULL_BODY' ? 'high' : 'medium') as IntensityLevel,
      defaultSets: 4,
      targetReps: item.type === 'DISTANCE_TIME' ? '2000m' : '10-12',
    }));
    const names = new Set(catalogList.map((e) => e.name));
    return [...catalogList, ...EXERCISE_DIRECTORY.filter((e) => !names.has(e.name))];
  }, [catalogData]);

  const filteredExercises =
    selectedMuscle === 'ALL'
      ? allExercises
      : allExercises.filter((ex) => ex.muscle === selectedMuscle);

  const handleAddFromLibrary = (ex: LibraryExercise) => {
    onAddWorkout(`${ex.name} ${ex.defaultSets}x${ex.targetReps}`, ex.muscle, ex.intensity, ex.defaultSets);
    onShowNotification(`Added "${ex.name}" to today's workout! 💪`, 'success');
  };

  const categories = ['ALL', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];

  return (
    <ContentWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            borderRadius: '8px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            color: 'primary.main',
          }}
        >
          <LibraryBooksIcon sx={{ fontSize: '1.4rem' }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            EXERCISE MOVEMENT DIRECTORY
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Browse standard movements and click &ldquo;Add to Session&rdquo; to log them into today&apos;s workout.
          </Typography>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Tabs
        value={selectedMuscle}
        onChange={(_, val) => setSelectedMuscle(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '4px',
          p: 0.25,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat} value={cat} label={cat} />
        ))}
      </Tabs>

      {/* Exercises Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filteredExercises.map((ex) => (
          <SpecListItem key={ex.name}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
                {ex.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                <Chip
                  label={ex.muscle}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: '2px',
                    backgroundColor: 'rgba(0, 216, 246, 0.12)',
                    color: '#00D8F6',
                    border: '1px solid rgba(0, 216, 246, 0.35)',
                  }}
                />
                <Chip
                  label={`${ex.defaultSets} SETS • ${ex.targetReps} REPS`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: '2px',
                    fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                    fontVariantNumeric: 'tabular-nums',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleAddFromLibrary(ex)}
              sx={{
                borderRadius: '4px',
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontWeight: 700,
              }}
            >
              ADD TO SESSION
            </Button>
          </SpecListItem>
        ))}
      </Box>
    </ContentWrapper>
  );
};
