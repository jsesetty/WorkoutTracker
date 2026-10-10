import React from 'react';
import { Box, Typography, Paper, Grid, LinearProgress } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { ContentWrapper, StatCard } from '../components/styled';
import { WorkoutItem, MuscleGroup } from '../types/workout';

interface AnalyticsPageProps {
  readonly workouts: WorkoutItem[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ workouts }) => {
  const total = workouts.length;
  const completed = workouts.filter((w) => w.completed).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Muscle group split
  const muscleGroups: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const muscleCounts = muscleGroups.map((group) => {
    const count = workouts.filter((w) => w.muscleGroup === group).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { group, count, percentage };
  });

  return (
    <ContentWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
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
          <InsightsIcon sx={{ fontSize: '1.4rem' }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            TRAINING PERFORMANCE & ANALYTICS
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Volume breakdown, completion metrics, and muscle group split balance.
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard accentColor="#059669">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: '1.3rem' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
                COMPLETION RATE
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)", fontVariantNumeric: 'tabular-nums' }}>
              {completionRate}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
              {completed} of {total} movements conquered
            </Typography>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatCard accentColor="#FF5500">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <FitnessCenterIcon sx={{ color: '#FF5500', fontSize: '1.2rem' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
                TOTAL VOLUME
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)", fontVariantNumeric: 'tabular-nums' }}>
              {workouts.reduce((acc, w) => acc + (w.sets || 3), 0)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
              Total working sets logged
            </Typography>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatCard accentColor="#00D8F6">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <WhatshotIcon sx={{ color: '#00D8F6', fontSize: '1.2rem' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
                HIGH EFFORT
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)", fontVariantNumeric: 'tabular-nums' }}>
              {workouts.filter((w) => w.intensity === 'high').length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
              Max effort working movements
            </Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Muscle Group Split Distribution */}
      <Paper sx={{ p: 2.5, borderRadius: '4px', mt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", letterSpacing: '-0.02em' }}>
          MUSCLE GROUP VOLUME DISTRIBUTION
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          {muscleCounts.map(({ group, count, percentage }) => (
            <Box key={group}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
                  {group}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)", fontVariantNumeric: 'tabular-nums' }}>
                  {count} exercises ({percentage}%)
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={percentage} sx={{ height: 6, borderRadius: 2 }} />
            </Box>
          ))}
        </Box>
      </Paper>
    </ContentWrapper>
  );
};
