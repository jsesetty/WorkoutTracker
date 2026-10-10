import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import {
  ConsoleRightRail,
  RailCard,
  RailSectionTitle,
  ChronometerDigits,
} from './styled';
import { MacroProgressBar } from './MacroProgressBar';
import { WorkoutItem } from '../types/workout';
import { storage } from '../services/storageFallback';
import { useSettings } from '../context/SettingsContext';

interface DesktopTelemetryRailProps {
  readonly workouts: WorkoutItem[];
  readonly workoutBurnedCalories: number;
}

export const DesktopTelemetryRail: React.FC<DesktopTelemetryRailProps> = ({
  workouts,
  workoutBurnedCalories,
}) => {
  const navigate = useNavigate();
  const { unit, restTimer } = useSettings();

  // ---------------------------------------------------------
  // 1. Mechanical Rest Chronometer
  // ---------------------------------------------------------
  const [selectedDuration, setSelectedDuration] = useState<number>(restTimer);
  const [timeLeft, setTimeLeft] = useState<number>(restTimer);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) {
      setSelectedDuration(restTimer);
      setTimeLeft(restTimer);
    }
  }, [restTimer, isRunning]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
    setIsFinished(false);
  };

  const handleSelectPreset = (seconds: number) => {
    setIsRunning(false);
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsFinished(false);
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---------------------------------------------------------
  // 2. Session Tonnage & Workload Volume
  // ---------------------------------------------------------
  const tonnageStats = useMemo(() => {
    let totalKg = 0;
    let completedSetsCount = 0;
    let totalSetsCount = 0;

    for (const w of workouts) {
      const sets = w.setDetails || [];
      totalSetsCount += sets.length;

      for (const s of sets) {
        if (s.completed) {
          completedSetsCount += 1;
          const weightNum = parseFloat(String(s.weight || '0').replace(/[^0-9.]/g, '')) || 0;
          const repsNum = typeof s.reps === 'number' ? s.reps : parseInt(String(s.reps || '0'), 10) || 0;
          const isLbs = String(s.weight || '').toLowerCase().includes('lb');
          const weightKg = isLbs ? weightNum * 0.453592 : weightNum;
          totalKg += weightKg * repsNum;
        }
      }
    }

    const displayTonnage = unit === 'lbs' ? Math.round(totalKg * 2.20462) : Math.round(totalKg);

    return {
      tonnageKg: Math.round(totalKg),
      displayTonnage,
      completedSetsCount,
      totalSetsCount,
      completionPercent: totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0,
    };
  }, [workouts, unit]);

  // ---------------------------------------------------------
  // 3. Daily Fuel & Nutritional Goals
  // ---------------------------------------------------------
  const goals = useMemo(() => storage.getGoals(), []);
  const meals = useMemo(() => storage.getMeals(), []);

  const nutritionTotals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const remainingCalories = goals.calorieTarget - nutritionTotals.calories + workoutBurnedCalories;

  return (
    <ConsoleRightRail aria-label="Console Live Telemetry">
      {/* 1. Mechanical Rest Chronometer */}
      <RailCard
        elevation={0}
        sx={{
          borderColor: isFinished ? 'warning.main' : isRunning ? 'primary.main' : 'divider',
          transition: 'border-color 0.15s ease-out',
        }}
      >
        <RailSectionTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <TimerIcon sx={{ fontSize: '0.95rem', color: isRunning ? 'primary.main' : 'text.secondary' }} />
            <span>REST CHRONOMETER</span>
          </Box>
          <Chip
            label={isFinished ? 'READY' : isRunning ? 'TIMING' : 'STANDBY'}
            size="small"
            color={isFinished ? 'success' : isRunning ? 'primary' : 'default'}
            sx={{
              height: 16,
              fontSize: '0.6rem',
              fontWeight: 700,
              borderRadius: '2px',
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            }}
          />
        </RailSectionTitle>

        {/* Digital Clock Display */}
        <Box
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: '4px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#181D26' : '#F8FAFC',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <ChronometerDigits
            sx={{
              color: isFinished ? '#059669' : isRunning ? '#FF5500' : 'text.primary',
            }}
          >
            {formatTime(timeLeft)}
          </ChronometerDigits>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: '0.65rem',
              fontWeight: 600,
              color: isFinished ? 'success.main' : 'text.secondary',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {isFinished ? 'Rest complete — Execute next working set!' : `${selectedDuration}s set interval target`}
          </Typography>
        </Box>

        {/* Chronometer Preset Selector */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[30, 60, 90, 120].map((sec) => (
            <Button
              key={sec}
              size="small"
              variant={selectedDuration === sec ? 'contained' : 'outlined'}
              color={selectedDuration === sec ? 'primary' : 'inherit'}
              onClick={() => handleSelectPreset(sec)}
              sx={{
                flex: 1,
                minWidth: 0,
                py: 0.3,
                fontSize: '0.68rem',
                fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                fontWeight: 700,
                borderRadius: '2px',
                borderColor: 'divider',
              }}
            >
              {sec}s
            </Button>
          ))}
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleStartPause}
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '4px',
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            }}
          >
            {isRunning ? 'PAUSE' : timeLeft === 0 ? 'RESTART' : 'START REST'}
          </Button>

          <Tooltip title="Reset chronometer">
            <IconButton
              size="small"
              onClick={handleReset}
              sx={{
                borderRadius: '4px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                color: 'text.secondary',
              }}
            >
              <ReplayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </RailCard>

      {/* 2. Session Volume & Tonnage Telemetry */}
      <RailCard elevation={0}>
        <RailSectionTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <FitnessCenterIcon sx={{ fontSize: '0.95rem', color: '#00D8F6' }} />
            <span>SESSION TONNAGE</span>
          </Box>
          <Chip
            label="TELEMETRY"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              fontWeight: 700,
              borderRadius: '2px',
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            }}
          />
        </RailSectionTitle>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {/* Tonnage Pod */}
          <Box
            sx={{
              p: 1.25,
              borderRadius: '4px',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#181D26' : '#F8FAFC',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
              LOAD MOVED
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                fontWeight: 800,
                color: 'text.primary',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '1.05rem',
                lineHeight: 1.2,
                mt: 0.25,
              }}
            >
              {tonnageStats.displayTonnage.toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#8893A4' }}>{unit.toUpperCase()}</span>
            </Typography>
          </Box>

          {/* Sets Done Pod */}
          <Box
            sx={{
              p: 1.25,
              borderRadius: '4px',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#181D26' : '#F8FAFC',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
              CONQUERED
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                fontWeight: 800,
                color: tonnageStats.completionPercent === 100 && tonnageStats.totalSetsCount > 0 ? '#059669' : 'text.primary',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '1.05rem',
                lineHeight: 1.2,
                mt: 0.25,
              }}
            >
              {tonnageStats.completedSetsCount}/{tonnageStats.totalSetsCount} <span style={{ fontSize: '0.7rem', color: '#8893A4' }}>SETS</span>
            </Typography>
          </Box>
        </Box>

        {/* Burned Energy Pod */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderRadius: '4px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 85, 0, 0.08)' : 'rgba(255, 85, 0, 0.05)',
            border: '1px solid rgba(255, 85, 0, 0.25)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocalFireDepartmentIcon sx={{ color: '#FF5500', fontSize: '1.1rem' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.72rem' }}>
              TRAINING OUTPUT BURN
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
              fontWeight: 800,
              color: '#FF5500',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '0.85rem',
            }}
          >
            +{workoutBurnedCalories} kcal
          </Typography>
        </Box>
      </RailCard>

      {/* 3. Daily Fuel & Macro Breakdown */}
      <RailCard elevation={0}>
        <RailSectionTitle>
          <span>DAILY FUEL GAUGE</span>
          <Chip
            label={`${Math.max(0, remainingCalories)} KCAL LEFT`}
            size="small"
            color={remainingCalories >= 0 ? 'success' : 'error'}
            variant="outlined"
            sx={{
              height: 16,
              fontSize: '0.62rem',
              fontWeight: 700,
              borderRadius: '2px',
              fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
            }}
          />
        </RailSectionTitle>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <MacroProgressBar
            label="Protein"
            current={nutritionTotals.protein}
            target={goals.proteinTarget}
            color="#FF5500"
            unit="g"
          />
          <MacroProgressBar
            label="Carbs"
            current={nutritionTotals.carbs}
            target={goals.carbsTarget}
            color="#00D8F6"
            unit="g"
          />
          <MacroProgressBar
            label="Fats"
            current={nutritionTotals.fat}
            target={goals.fatTarget}
            color="#EAB308"
            unit="g"
          />
        </Box>

        <Button
          size="small"
          variant="text"
          color="inherit"
          endIcon={<ArrowForwardIcon sx={{ fontSize: '0.85rem !important' }} />}
          onClick={() => navigate('/nutrition')}
          sx={{
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'text.secondary',
            fontWeight: 600,
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            p: 0.5,
            '&:hover': { color: 'primary.main' },
          }}
        >
          <span>OPEN NUTRITIONAL DIARY</span>
        </Button>
      </RailCard>
    </ConsoleRightRail>
  );
};
