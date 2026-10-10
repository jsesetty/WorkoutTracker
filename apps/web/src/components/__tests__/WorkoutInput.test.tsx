import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { WorkoutInput } from '../WorkoutInput';
import { getGymTheme } from '../../theme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={getGymTheme('dark')}>
      {ui}
    </ThemeProvider>
  );
};

describe('WorkoutInput Component', () => {
  test('renders exercise input field and LOG button', () => {
    renderWithTheme(<WorkoutInput onAddWorkout={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Incline Dumbbell Bench Press/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log/i })).toBeInTheDocument();
  });

  test('calls onAddWorkout with title, muscleGroup, intensity, and sets on form submit', async () => {
    const handleAddWorkout = jest.fn();
    renderWithTheme(<WorkoutInput onAddWorkout={handleAddWorkout} />);

    const input = screen.getByPlaceholderText(/Incline Dumbbell Bench Press/i);
    await userEvent.type(input, 'Barbell Back Squats');

    const submitBtn = screen.getByRole('button', { name: /log/i });
    fireEvent.click(submitBtn);

    expect(handleAddWorkout).toHaveBeenCalledTimes(1);
    expect(handleAddWorkout).toHaveBeenCalledWith('Barbell Back Squats', 'Chest', 'medium', 3, 10, '');
    expect((input as HTMLInputElement).value).toBe('');
  });

  test('submits with custom weight when provided', async () => {
    const handleAddWorkout = jest.fn();
    renderWithTheme(<WorkoutInput onAddWorkout={handleAddWorkout} />);

    const titleInput = screen.getByPlaceholderText(/Incline Dumbbell Bench Press/i);
    await userEvent.type(titleInput, 'Overhead Press');

    const weightInput = screen.getByPlaceholderText(/e\.g\. 80 kg/i);
    await userEvent.type(weightInput, '60 kg');

    const submitBtn = screen.getByRole('button', { name: /log/i });
    fireEvent.click(submitBtn);

    expect(handleAddWorkout).toHaveBeenCalledWith('Overhead Press', 'Chest', 'medium', 3, 10, '60 kg');
  });

  test('increments and decrements sets and reps steppers correctly', () => {
    const handleAddWorkout = jest.fn();
    renderWithTheme(<WorkoutInput onAddWorkout={handleAddWorkout} />);

    expect(screen.getByText('3 SETS')).toBeInTheDocument();
    expect(screen.getByText('10 REPS')).toBeInTheDocument();

    const increaseSetsBtn = screen.getByLabelText('Increase sets');
    fireEvent.click(increaseSetsBtn);
    expect(screen.getByText('4 SETS')).toBeInTheDocument();

    const increaseRepsBtn = screen.getByLabelText('Increase reps');
    fireEvent.click(increaseRepsBtn);
    expect(screen.getByText('11 REPS')).toBeInTheDocument();
  });

  test('does not submit when input is only whitespace', async () => {
    const handleAddWorkout = jest.fn();
    renderWithTheme(<WorkoutInput onAddWorkout={handleAddWorkout} />);

    const input = screen.getByPlaceholderText(/Incline Dumbbell Bench Press/i);
    await userEvent.type(input, '   ');

    const submitBtn = screen.getByRole('button', { name: /log/i });
    fireEvent.click(submitBtn);

    expect(handleAddWorkout).not.toHaveBeenCalled();
  });

  test('clicking preset chip populates exercise title field', () => {
    const handleAddWorkout = jest.fn();
    renderWithTheme(<WorkoutInput onAddWorkout={handleAddWorkout} />);

    const presetChip = screen.getByRole('button', { name: 'Barbell Flat Bench' });
    fireEvent.click(presetChip);

    const input = screen.getByPlaceholderText(/Incline Dumbbell Bench Press/i) as HTMLInputElement;
    expect(input.value).toBe('Barbell Flat Bench');
  });
});
