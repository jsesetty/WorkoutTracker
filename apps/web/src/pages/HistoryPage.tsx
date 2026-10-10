import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ContentWrapper, SpecListItem } from '../components/styled';
import { WorkoutItem } from '../types/workout';

interface HistoryPageProps {
  readonly workouts: WorkoutItem[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ workouts }) => {
  const completedWorkouts = workouts.filter((w) => w.completed);

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
          <HistoryIcon sx={{ fontSize: '1.4rem' }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            WORKOUT SESSION LOGS & HISTORY
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Archived logs of conquered exercises and historical training volumes.
          </Typography>
        </Box>
      </Box>

      {completedWorkouts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '10px',
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            No completed workouts logged in history yet.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            Finish exercises in your daily tracker to populate your training history.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {completedWorkouts.map((w) => (
            <SpecListItem key={w.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: '1.3rem' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {w.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {w.muscleGroup} • {w.sets || 3} SETS • {w.intensity.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={w.completedAt ? new Date(w.completedAt).toLocaleDateString() : 'LOGGED'}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.68rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  borderColor: 'divider',
                }}
              />
            </SpecListItem>
          ))}
        </Box>
      )}
    </ContentWrapper>
  );
};

