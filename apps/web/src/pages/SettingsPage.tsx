import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ContentWrapper } from '../components/styled';

interface SettingsPageProps {
  readonly mode: 'dark' | 'light';
  readonly onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ mode, onToggleTheme }) => {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [restTimer, setRestTimer] = useState<number>(90);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  return (
    <ContentWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.25,
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 245, 155, 0.12)',
            color: 'primary.main',
            boxShadow: '0 0 16px rgba(0, 245, 155, 0.25)',
          }}
        >
          <SettingsIcon sx={{ fontSize: '1.8rem' }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            TRACKER PREFERENCES & SETTINGS
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Customize weight units, rest timer defaults, and workout environment.
          </Typography>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 3.5,
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.75,
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Weight Units */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Weight Measurement Units
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Standard unit used across all logged exercises
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="weight-unit-label">Unit</InputLabel>
            <Select
              labelId="weight-unit-label"
              value={unit}
              label="Unit"
              onChange={(e) => setUnit(e.target.value as 'kg' | 'lbs')}
            >
              <MenuItem value="kg">Kilograms (kg)</MenuItem>
              <MenuItem value="lbs">Pounds (lbs)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Default Rest Timer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Default Rest Timer Interval
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Target rest duration between working sets
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="rest-timer-label">Timer</InputLabel>
            <Select
              labelId="rest-timer-label"
              value={restTimer}
              label="Timer"
              onChange={(e) => setRestTimer(Number(e.target.value))}
            >
              <MenuItem value={60}>60 Seconds</MenuItem>
              <MenuItem value={90}>90 Seconds</MenuItem>
              <MenuItem value={120}>120 Seconds</MenuItem>
              <MenuItem value={180}>180 Seconds</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Theme Preference */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Theme Mode
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Current appearance: {mode === 'dark' ? 'Obsidian Void (Dark)' : 'Alabaster Chalk (Light)'}
            </Typography>
          </Box>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={onToggleTheme} color="primary" />}
            label="Dark Mode"
          />
        </Box>

        <Divider />

        {/* Sound Feedback */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Completion Confetti Feedback
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Trigger visual celebration confetti when conquering all planned exercises
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Enabled"
          />
        </Box>
      </Paper>
    </ContentWrapper>
  );
};
