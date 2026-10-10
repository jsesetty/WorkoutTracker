import React from 'react';
import { Box, Typography } from '@mui/material';
import { YukaBadge } from './styled';
import { YukaRating } from '../types/nutrition';

interface YukaScoreBadgeProps {
  readonly score: number;
  readonly rating: YukaRating;
  readonly showRatingLabel?: boolean;
}

export const YukaScoreBadge: React.FC<YukaScoreBadgeProps> = ({
  score,
  rating,
  showRatingLabel = true,
}) => {
  return (
    <YukaBadge rating={rating} data-testid="yuka-score-badge">
      <Box
        component="span"
        sx={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block',
        }}
      />
      <Typography
        component="span"
        sx={{
          fontFamily: 'var(--font-telemetry)',
          fontVariantNumeric: 'tabular-nums',
          fontSize: 'inherit',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {score}/100
      </Typography>
      {showRatingLabel && (
        <Typography
          component="span"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.66rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            opacity: 0.9,
            lineHeight: 1,
          }}
        >
          {rating}
        </Typography>
      )}
    </YukaBadge>
  );
};
