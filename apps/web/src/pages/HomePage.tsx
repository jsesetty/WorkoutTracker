import React from 'react';
import { Box, Typography } from '@mui/material';
import { WorkoutMeter } from '../components/WorkoutMeter';
import { WorkoutInput } from '../components/WorkoutInput';
import { WorkoutToolbar } from '../components/WorkoutToolbar';
import { WorkoutList } from '../components/WorkoutList';
import { SessionConfetti } from '../components/SessionConfetti';
import { ContentWrapper } from '../components/styled';
import { WorkoutItem, WorkoutSet, MuscleGroup, IntensityLevel, FilterType, WorkoutFilterCounts } from '../types/workout';

interface HomePageProps {
  readonly workouts: WorkoutItem[];
  readonly filter: FilterType;
  readonly counts: WorkoutFilterCounts;
  readonly confettiTrigger: number;
  readonly onAddWorkout: (
    title: string,
    muscleGroup: MuscleGroup,
    intensity: IntensityLevel,
    sets: number,
    reps?: number | string,
    weight?: string
  ) => void;
  readonly onToggleWorkout: (id: string) => void;
  readonly onUpdateTitle: (id: string, newTitle: string) => void;
  readonly onDeleteWorkout: (id: string) => void;
  readonly onFilterChange: (filter: FilterType) => void;
  readonly onClearCompleted: () => void;
  readonly onAddSet?: (workoutId: string) => void;
  readonly onUpdateSet?: (workoutId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  readonly onDeleteSet?: (workoutId: string, setId: string) => void;
  readonly workoutBurnedCalories?: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  workouts,
  filter,
  counts,
  confettiTrigger,
  onAddWorkout,
  onToggleWorkout,
  onUpdateTitle,
  onDeleteWorkout,
  onFilterChange,
  onClearCompleted,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
  workoutBurnedCalories,
}) => {
  const filteredWorkouts = React.useMemo(() => {
    if (filter === 'active') return workouts.filter((w) => !w.completed);
    if (filter === 'completed') return workouts.filter((w) => w.completed);
    return workouts;
  }, [workouts, filter]);

  return (
    <ContentWrapper>
      <SessionConfetti trigger={confettiTrigger} />

      {/* Workout Progress Meter */}
      <WorkoutMeter
        total={counts.all}
        completed={counts.completed}
        burnedCalories={workoutBurnedCalories}
      />

      {/* Quick Exercise Logger Form */}
      <WorkoutInput onAddWorkout={onAddWorkout} />

      {/* Filter Toolbar */}
      <WorkoutToolbar
        filter={filter}
        onFilterChange={onFilterChange}
        counts={counts}
        onClearCompleted={onClearCompleted}
      />

      {/* Workout Session List */}
      <WorkoutList
        workouts={filteredWorkouts}
        filter={filter}
        total={counts.all}
        onToggle={onToggleWorkout}
        onDelete={onDeleteWorkout}
        onUpdateTitle={onUpdateTitle}
        onAddSet={onAddSet}
        onUpdateSet={onUpdateSet}
        onDeleteSet={onDeleteSet}
      />

      {/* Footer Info */}
      <Box sx={{ textAlign: 'center', pt: 1, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
            opacity: 0.7,
          }}
        >
          Tip: Double-click any exercise title to edit in-place
        </Typography>
      </Box>
    </ContentWrapper>
  );
};
