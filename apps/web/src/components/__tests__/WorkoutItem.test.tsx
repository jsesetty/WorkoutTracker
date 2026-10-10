import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { WorkoutItem } from '../WorkoutItem';
import { getGymTheme } from '../../theme';
import { WorkoutItem as WorkoutItemType } from '../../types/workout';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={getGymTheme('dark')}>
      {ui}
    </ThemeProvider>
  );
};

const mockWorkout: WorkoutItemType = {
  id: 'workout-1',
  title: 'Barbell Flat Bench Press',
  muscleGroup: 'Chest',
  intensity: 'high',
  sets: 4,
  reps: '8-10',
  weight: '85 kg',
  completed: false,
  createdAt: new Date().toISOString(),
};

describe('WorkoutItem Component', () => {
  test('renders exercise title, muscle group chip, and MAX EFFORT intensity badge', () => {
    renderWithTheme(
      <WorkoutItem
        workout={mockWorkout}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdateTitle={jest.fn()}
      />
    );

    expect(screen.getByText('Barbell Flat Bench Press')).toBeInTheDocument();
    expect(screen.getByText('CHEST')).toBeInTheDocument();
    expect(screen.getByText('MAX EFFORT')).toBeInTheDocument();
    expect(screen.getByText('4 SETS')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', () => {
    const handleToggle = jest.fn();
    renderWithTheme(
      <WorkoutItem
        workout={mockWorkout}
        onToggle={handleToggle}
        onDelete={jest.fn()}
        onUpdateTitle={jest.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith('workout-1');
  });

  test('calls onDelete when delete icon is clicked', () => {
    const handleDelete = jest.fn();
    renderWithTheme(
      <WorkoutItem
        workout={mockWorkout}
        onToggle={jest.fn()}
        onDelete={handleDelete}
        onUpdateTitle={jest.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText('Remove exercise');
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('workout-1');
  });

  test('allows inline editing of title on double click and committing with Enter', async () => {
    const handleUpdateTitle = jest.fn();
    renderWithTheme(
      <WorkoutItem
        workout={mockWorkout}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdateTitle={handleUpdateTitle}
      />
    );

    const titleEl = screen.getByText('Barbell Flat Bench Press');
    fireEvent.doubleClick(titleEl);

    const editInput = screen.getByLabelText('Edit exercise title');
    expect(editInput).toBeInTheDocument();

    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Incline Dumbbell Press{enter}');

    expect(handleUpdateTitle).toHaveBeenCalledTimes(1);
    expect(handleUpdateTitle).toHaveBeenCalledWith('workout-1', 'Incline Dumbbell Press');
  });

  test('renders sets log table, triggers onAddSet, and handles reps adjustment', () => {
    const handleAddSet = jest.fn();
    const handleUpdateSet = jest.fn();
    renderWithTheme(
      <WorkoutItem
        workout={mockWorkout}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdateTitle={jest.fn()}
        onAddSet={handleAddSet}
        onUpdateSet={handleUpdateSet}
      />
    );

    // Verify sets table headers and set rows
    expect(screen.getByText('SET')).toBeInTheDocument();
    expect(screen.getByText('WEIGHT')).toBeInTheDocument();
    expect(screen.getByText('REPS')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();

    // Click Add Set button
    const addSetBtn = screen.getByLabelText('Add working set');
    fireEvent.click(addSetBtn);
    expect(handleAddSet).toHaveBeenCalledWith('workout-1');

    // Click increase weight on Set 1 (starts at '85 kg', incrementing to '87.5 kg')
    const incWeightBtn = screen.getByLabelText('Increase weight for set 1');
    fireEvent.click(incWeightBtn);
    expect(handleUpdateSet).toHaveBeenCalledWith('workout-1', 'workout-1-s-1', { weight: '87.5 kg' });

    // Type in weight input for Set 1
    const weightInput = screen.getByLabelText('Weight for set 1');
    fireEvent.change(weightInput, { target: { value: '90 kg' } });
    expect(handleUpdateSet).toHaveBeenCalledWith('workout-1', 'workout-1-s-1', { weight: '90 kg' });

    // Click increase reps on Set 1 (starts at parseInt('8-10') = 8, incrementing to 9)
    const incRepsBtn = screen.getByLabelText('Increase reps for set 1');
    fireEvent.click(incRepsBtn);
    expect(handleUpdateSet).toHaveBeenCalledWith('workout-1', 'workout-1-s-1', { reps: 9 });
  });
});
