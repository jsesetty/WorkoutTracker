import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { WorkoutMeter, getWorkoutIntensityRank } from '../WorkoutMeter';
import { getGymTheme } from '../../theme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={getGymTheme('dark')}>
      {ui}
    </ThemeProvider>
  );
};

describe('WorkoutMeter Component & Intensity Calculation', () => {
  test('correctly calculates intensity ranks based on workout completion percentage', () => {
    expect(getWorkoutIntensityRank(0, 0).title).toBe('REST / STANDBY');
    expect(getWorkoutIntensityRank(0, 5).title).toBe('WARMUP & MOBILITY');
    expect(getWorkoutIntensityRank(20, 5).title).toBe('INITIATING VOLUME');
    expect(getWorkoutIntensityRank(40, 5).title).toBe('IN THE ZONE');
    expect(getWorkoutIntensityRank(60, 5).title).toBe('HIGH OUTPUT');
    expect(getWorkoutIntensityRank(80, 5).title).toBe('PEAK INTENSITY');
    expect(getWorkoutIntensityRank(100, 5).title).toBe('SESSION CRUSHED! 🔥');
  });

  test('renders 0% and WARMUP & MOBILITY when no exercises are finished', () => {
    renderWithTheme(<WorkoutMeter total={4} completed={0} />);
    expect(screen.getByText('WARMUP & MOBILITY')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText(/EXERCISES COMPLETED:/i)).toBeInTheDocument();
  });

  test('renders IN THE ZONE and 50% when half of exercises are completed', () => {
    renderWithTheme(<WorkoutMeter total={4} completed={2} />);
    expect(screen.getByText('IN THE ZONE')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('renders SESSION CRUSHED and 100% when all exercises are finished', () => {
    renderWithTheme(<WorkoutMeter total={4} completed={4} />);
    expect(screen.getByText('SESSION CRUSHED! 🔥')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(/ALL EXERCISES FINISHED!/i)).toBeInTheDocument();
  });
});
