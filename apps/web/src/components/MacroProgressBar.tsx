import React from 'react';
import { Box, Typography } from '@mui/material';
import { MacroProgressWrapper, MacroTrack, MacroBarFill } from './styled';

interface MacroProgressBarProps {
  readonly label: string;
  readonly current: number;
  readonly target: number;
  readonly color: string;
  readonly unit?: string;
}

export const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  label,
  current,
  target,
  color,
  unit = 'g',
}) => {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;

  return (
    <MacroProgressWrapper data-testid={`macro-bar-${label.toLowerCase()}`}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
              fontVariantNumeric: 'tabular-nums',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {Math.round(current)}
            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}>
              {' / '}{target}{unit}
            </Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
              fontVariantNumeric: 'tabular-nums',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: color,
            }}
          >
            {percentage}%
          </Typography>
        </Box>
      </Box>
      <MacroTrack>
        <MacroBarFill fillColor={color} percentage={percentage} />
      </MacroTrack>
    </MacroProgressWrapper>
  );
};
