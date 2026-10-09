import React from 'react';
import { Box } from '@mui/material';
import { WorkoutItem } from './WorkoutItem';
import { EmptyState } from './EmptyState';
import { WorkoutListUl } from './styled';
import { WorkoutItem as WorkoutItemType, WorkoutSet, FilterType } from '../types/workout';

interface WorkoutListProps {
  readonly workouts?: WorkoutItemType[];
  readonly todos?: WorkoutItemType[];
  readonly filter: FilterType;
  readonly total: number;
  readonly onToggle: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onUpdateTitle: (id: string, newTitle: string) => void;
  readonly onAddSet?: (workoutId: string) => void;
  readonly onUpdateSet?: (workoutId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  readonly onDeleteSet?: (workoutId: string, setId: string) => void;
}

export const WorkoutList: React.FC<WorkoutListProps> = ({
  workouts,
  todos,
  filter,
  total,
  onToggle,
  onDelete,
  onUpdateTitle,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
}) => {
  const list = workouts || todos || [];

  if (list.length === 0) {
    return (
      <WorkoutListUl id="todo-list">
        <Box component="li">
          <EmptyState filter={filter} total={total} />
        </Box>
      </WorkoutListUl>
    );
  }

  return (
    <WorkoutListUl id="todo-list">
      {list.map((workout) => (
        <Box component="li" key={workout.id}>
          <WorkoutItem
            workout={workout}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateTitle={onUpdateTitle}
            onAddSet={onAddSet}
            onUpdateSet={onUpdateSet}
            onDeleteSet={onDeleteSet}
          />
        </Box>
      ))}
    </WorkoutListUl>
  );
};

// Backward-compatible alias
export const TaskList = WorkoutList;
