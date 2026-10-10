import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import { MeterCard, HudMetricPod } from './styled';
import { TransformationRank } from '../types/workout';

export const getWorkoutIntensityRank = (percentage: number, totalTasks: number): TransformationRank => {
  if (totalTasks === 0) return { title: 'REST / STANDBY', bp: 'OUTPUT: 0%', color: '#8893A4' };
  if (percentage === 0) return { title: 'WARMUP & MOBILITY', bp: 'OUTPUT: PRE-TRAIN', color: '#5E697A' };
  if (percentage <= 25) return { title: 'INITIATING VOLUME', bp: 'OUTPUT: 25%', color: '#00D8F6' };
  if (percentage <= 50) return { title: 'IN THE ZONE', bp: 'OUTPUT: 50%', color: '#EAB308' };
  if (percentage <= 75) return { title: 'HIGH OUTPUT', bp: 'OUTPUT: 75%', color: '#FF5500' };
  if (percentage < 100) return { title: 'PEAK INTENSITY', bp: 'OUTPUT: 90%', color: '#059669' };
  return { title: 'SESSION CRUSHED! 🔥', bp: 'MAX EFFORT ⚡', color: '#059669' };
};

export const getTransformationRank = getWorkoutIntensityRank;

interface WorkoutMeterProps {
  readonly total: number;
  readonly completed: number;
  readonly burnedCalories?: number;
}

export const WorkoutMeter: React.FC<WorkoutMeterProps> = ({ total, completed, burnedCalories }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const rank = getWorkoutIntensityRank(percentage, total);
  const isMax = percentage === 100 && total > 0;
  const hasBurn = typeof burnedCalories === 'number' && burnedCalories > 0;

  return (
    <MeterCard elevation={0} isMax={isMax}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <BoltIcon sx={{ color: rank.color, fontSize: '1.15rem' }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'text.secondary',
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            }}
          >
            SESSION HUD // INTENSITY GAUGE
          </Typography>
        </Box>

        <Chip
          label={rank.title}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            borderColor: 'divider',
            color: 'text.primary',
            borderRadius: '2px',
          }}
        />
      </Box>

      {/* Metric Pods */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: hasBurn ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' },
          gap: 1.25,
          mb: 1.75,
        }}
      >
        {/* Metric 1: Completion */}
        <HudMetricPod>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
            COMPLETION RATE
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              mt: 0.25,
            }}
          >
            {percentage}%
          </Typography>
        </HudMetricPod>

        {/* Metric 2: Completed / Total */}
        <HudMetricPod>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
            MOVEMENTS CONQUERED
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              mt: 0.25,
            }}
          >
            {completed} <Typography component="span" sx={{ fontSize: '1rem', color: 'text.secondary' }}>/ {total}</Typography>
          </Typography>
        </HudMetricPod>

        {/* Metric 3: Output Phase */}
        <HudMetricPod>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
            ENERGY TARGET
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
            {isMax ? (
              <LocalFireDepartmentIcon sx={{ fontSize: '1.2rem', color: '#059669' }} />
            ) : (
              <FitnessCenterIcon sx={{ fontSize: '1.15rem', color: 'text.secondary' }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", color: rank.color }}>
              {rank.bp}
            </Typography>
          </Box>
        </HudMetricPod>

        {/* Metric 4: Burned Calories (Lyfta -> MyFitnessPal) */}
        {hasBurn && (
          <HudMetricPod>
            <Typography variant="caption" sx={{ color: '#FF5500', fontWeight: 600, fontSize: '0.7rem' }}>
              BURNED (MYFITNESSPAL)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <LocalFireDepartmentIcon sx={{ fontSize: '1.2rem', color: '#FF5500' }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#FF5500',
                  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                }}
              >
                +{burnedCalories}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.25 }}>
                kcal
              </Typography>
            </Box>
          </HudMetricPod>
        )}
      </Box>

      {/* Sleek Minimalist Progress Bar */}
      <Box sx={{ position: 'relative', my: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          aria-label="Workout Completion Progress"
        />
      </Box>

      {/* Subtext Counter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.72rem',
          }}
        >
          EXERCISES COMPLETED: <strong>{completed}</strong> / {total}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: isMax ? 'primary.main' : 'text.secondary',
            fontWeight: isMax ? 600 : 400,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.72rem',
          }}
        >
          {isMax ? 'ALL EXERCISES FINISHED!' : `${total - completed} REMAINING`}
        </Typography>
      </Box>
    </MeterCard>
  );
};

export const KiMeter = WorkoutMeter;
