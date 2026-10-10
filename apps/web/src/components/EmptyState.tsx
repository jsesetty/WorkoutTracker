import React from 'react';
import { Box, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { EmptyStateCard } from './styled';
import { FilterType } from '../types/workout';

interface EmptyStateProps {
  readonly filter: FilterType;
  readonly total: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter, total }) => {
  let title = 'ALL WORKOUTS CONQUERED!';
  let desc = 'Outstanding effort today! Every exercise in this session has been checked off. Take your rest or log another movement above.';

  if (total === 0) {
    title = 'NO EXERCISES LOGGED TODAY';
    desc = 'Add your target movements and exercises above to kickstart your training session.';
  } else if (filter === 'active') {
    title = 'SESSION COMPLETED! 🔥';
    desc = 'Incredible intensity! You have finished every planned exercise on your list.';
  } else if (filter === 'completed') {
    title = 'NO FINISHED EXERCISES YET';
    desc = 'Crush your working sets and check off exercises to see your achievements logged here.';
  }

  return (
    <EmptyStateCard elevation={0}>
      {/* Ambient Spotlight Halo */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 155, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          p: 2.25,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 245, 155, 0.1)',
          color: 'primary.main',
          mb: 2,
          border: '1px solid rgba(0, 245, 155, 0.25)',
          boxShadow: '0 0 24px rgba(0, 245, 155, 0.3)',
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: '2.75rem' }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          position: 'relative',
          fontWeight: 800,
          color: 'text.primary',
          fontFamily: "'Syne', sans-serif",
          letterSpacing: '-0.02em',
          mb: 0.75,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          position: 'relative',
          color: 'text.secondary',
          maxWidth: 440,
          mx: 'auto',
          lineHeight: 1.6,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {desc}
      </Typography>
    </EmptyStateCard>
  );
};
