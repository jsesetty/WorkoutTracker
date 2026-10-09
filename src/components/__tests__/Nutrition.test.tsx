import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { getGymTheme } from '../../theme';
import { YukaScoreBadge } from '../YukaScoreBadge';
import { MacroProgressBar } from '../MacroProgressBar';
import { WorkoutMeter } from '../WorkoutMeter';

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = getGymTheme('dark');
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('YukaScoreBadge Component', () => {
  it('renders score and Excellent rating correctly', () => {
    renderWithTheme(<YukaScoreBadge score={96} rating="Excellent" />);

    expect(screen.getByText(/96\/100/)).toBeInTheDocument();
    expect(screen.getByText(/excellent/i)).toBeInTheDocument();
  });

  it('renders score and Bad rating correctly', () => {
    renderWithTheme(<YukaScoreBadge score={14} rating="Bad" />);

    expect(screen.getByText(/14\/100/)).toBeInTheDocument();
    expect(screen.getByText(/bad/i)).toBeInTheDocument();
  });
});

describe('MacroProgressBar Component', () => {
  it('renders macro label, target, and calculates correct percentage', () => {
    renderWithTheme(
      <MacroProgressBar
        label="Protein"
        current={82}
        target={164}
        color="#10B981"
        unit="g"
      />
    );

    expect(screen.getByText(/protein/i)).toBeInTheDocument();
    expect(screen.getByText(/82/)).toBeInTheDocument();
    expect(screen.getByText(/164g/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });
});

describe('WorkoutMeter with Calorie Burn Telemetry (Lyfta Synergy)', () => {
  it('displays burned calories pod when burnedCalories is provided', () => {
    renderWithTheme(
      <WorkoutMeter total={5} completed={3} burnedCalories={240} />
    );

    expect(screen.getByText('BURNED (MYFITNESSPAL)')).toBeInTheDocument();
    expect(screen.getByText('+240')).toBeInTheDocument();
    expect(screen.getByText('kcal')).toBeInTheDocument();
  });

  it('omits burned calories pod when burnedCalories is 0 or undefined', () => {
    renderWithTheme(<WorkoutMeter total={5} completed={2} />);

    expect(screen.queryByText('BURNED (MYFITNESSPAL)')).not.toBeInTheDocument();
  });
});
