import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';
import {
  InputCard,
  MusclePillButton,
  IntensityToggleBtn,
  SetStepperBtn,
  PresetExerciseChip,
  StepperContainer,
} from './styled';
import { MuscleGroup, IntensityLevel } from '../types/workout';

interface WorkoutInputProps {
  readonly onAddWorkout: (
    title: string,
    muscleGroup: MuscleGroup,
    intensity: IntensityLevel,
    sets: number,
    reps?: number | string,
    weight?: string
  ) => void;
  readonly onAddTask?: (title: string, priority: IntensityLevel) => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio',
  'Full Body',
];

const MUSCLE_PRESETS: Record<MuscleGroup, readonly string[]> = {
  Chest: ['Barbell Flat Bench', 'Incline DB Press', 'Cable Chest Flyes', 'Weighted Dips', 'Push-ups'],
  Back: ['Barbell Deadlifts', 'Lat Pulldowns', 'Barbell Rows', 'Pull-ups', 'Seated Cable Row'],
  Legs: ['Barbell Back Squats', 'Romanian Deadlifts', 'Leg Press', 'Bulgarian Split Squats', 'Calf Raises'],
  Shoulders: ['Overhead Military Press', 'Dumbbell Lateral Raises', 'Face Pulls', 'Arnold Press'],
  Arms: ['Barbell Bicep Curls', 'Tricep Rope Pushdowns', 'Hammer Curls', 'Skull Crushers'],
  Core: ['Hanging Leg Raises', 'Cable Woodchoppers', 'Ab Wheel Rollout', 'Plank Hold'],
  Cardio: ['Treadmill Incline Run', 'Concept2 Rowing', 'Jump Rope Intervals', 'Stairmaster'],
  'Full Body': ['Clean & Press', 'Kettlebell Swings', 'Barbell Thrusters', 'Burpee Pull-ups'],
};

export const WorkoutInput: React.FC<WorkoutInputProps> = ({ onAddWorkout, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Chest');
  const [intensity, setIntensity] = useState<IntensityLevel>('medium');
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onAddWorkout) {
      onAddWorkout(title.trim(), muscleGroup, intensity, sets, reps, weight.trim());
    } else if (onAddTask) {
      onAddTask(title.trim(), intensity);
    }
    setTitle('');
    setWeight('');
  };

  const handleDecrementSets = () => {
    if (sets > 1) setSets(sets - 1);
  };

  const handleIncrementSets = () => {
    if (sets < 10) setSets(sets + 1);
  };

  const handleDecrementReps = () => {
    if (reps > 1) setReps(reps - 1);
  };

  const handleIncrementReps = () => {
    if (reps < 50) setReps(reps + 1);
  };

  return (
    <InputCard elevation={0}>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Tier 1: Header & Muscle Group Selection */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'text.secondary',
              fontSize: '0.72rem',
            }}
          >
            LOG NEW MOVEMENT
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.7rem',
              opacity: 0.7,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Select muscle group or tap preset
          </Typography>
        </Box>

        {/* Muscle Selector Pills Carousel */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            overflowX: 'auto',
            pb: 0.75,
            mb: 1.5,
            '&::-webkit-scrollbar': { height: 3 },
          }}
        >
          {MUSCLE_GROUPS.map((mg) => (
            <MusclePillButton
              key={mg}
              type="button"
              active={muscleGroup === mg}
              onClick={() => setMuscleGroup(mg)}
            >
              {mg}
            </MusclePillButton>
          ))}
        </Box>

        {/* Tier 2: Dedicated Full-Width Exercise Name Input */}
        <Box sx={{ mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            id="task-title-input"
            label="EXERCISE NAME"
            placeholder="e.g. Incline Dumbbell Bench Press 3x10..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 140 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FitnessCenterIcon sx={{ color: 'primary.main', fontSize: '1.15rem' }} />
                </InputAdornment>
              ),
              endAdornment: title ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setTitle('')}
                    aria-label="Clear exercise name"
                    sx={{ padding: '2px', color: 'text.secondary' }}
                  >
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        </Box>

        {/* Quick Muscle Presets — Sleek Horizontal Ribbon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            mb: 1.5,
            pb: 0.5,
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.68rem',
              color: 'text.secondary',
              mr: 0.5,
              flexShrink: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Presets:
          </Typography>
          {MUSCLE_PRESETS[muscleGroup].map((preset) => (
            <PresetExerciseChip
              key={preset}
              type="button"
              style={{ flexShrink: 0 }}
              onClick={() => setTitle(preset)}
            >
              {preset}
            </PresetExerciseChip>
          ))}
        </Box>

        {/* Tier 3: Parameter Controls & Action Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            pt: 1.25,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Row A: Intensity Segmented Control */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              width: '100%',
            }}
          >
            <IntensityToggleBtn
              type="button"
              active={intensity === 'low'}
              accentColor="#0284C7"
              onClick={() => setIntensity('low')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              WARMUP
            </IntensityToggleBtn>

            <IntensityToggleBtn
              type="button"
              active={intensity === 'medium'}
              accentColor="#D97706"
              onClick={() => setIntensity('medium')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              MODERATE
            </IntensityToggleBtn>

            <IntensityToggleBtn
              type="button"
              active={intensity === 'high'}
              accentColor="#DC2626"
              onClick={() => setIntensity('high')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              MAX EFFORT
            </IntensityToggleBtn>
          </Box>

          {/* Row B: Steppers + Weight Input + Submit Action */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            {/* Sets Stepper */}
            <StepperContainer sx={{ flex: { xs: '1 1 calc(50% - 4px)', sm: 'initial' }, justifyContent: 'center' }}>
              <SetStepperBtn type="button" onClick={handleDecrementSets} aria-label="Decrease sets">
                -
              </SetStepperBtn>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  minWidth: '48px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                }}
              >
                {sets} SETS
              </Typography>
              <SetStepperBtn type="button" onClick={handleIncrementSets} aria-label="Increase sets">
                +
              </SetStepperBtn>
            </StepperContainer>

            {/* Reps Stepper */}
            <StepperContainer sx={{ flex: { xs: '1 1 calc(50% - 4px)', sm: 'initial' }, justifyContent: 'center' }}>
              <SetStepperBtn type="button" onClick={handleDecrementReps} aria-label="Decrease reps">
                -
              </SetStepperBtn>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  minWidth: '48px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                }}
              >
                {reps} REPS
              </Typography>
              <SetStepperBtn type="button" onClick={handleIncrementReps} aria-label="Increase reps">
                +
              </SetStepperBtn>
            </StepperContainer>

            {/* Weight Input Field */}
            <TextField
              size="small"
              id="task-weight-input"
              label="WEIGHT"
              placeholder="e.g. 80 kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 110 },
                flex: { xs: '1 1 100%', sm: 'none' },
              }}
              inputProps={{
                maxLength: 20,
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.85rem',
                },
              }}
            />

            {/* Action Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              id="add-task-btn"
              startIcon={<AddIcon />}
              sx={{
                minWidth: { xs: '100%', sm: 105 },
                py: 0.85,
                whiteSpace: 'nowrap',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                borderRadius: '4px',
                letterSpacing: '0.03em',
                ml: { xs: 0, sm: 'auto' },
              }}
            >
              LOG
            </Button>
          </Box>
        </Box>
      </Box>
    </InputCard>
  );
};

export const TaskInput = WorkoutInput;
