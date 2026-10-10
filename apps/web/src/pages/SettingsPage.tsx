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
  Button,
  Chip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { ContentWrapper } from '../components/styled';
import { useAuth } from '../auth/AuthProvider';
import { AuthModal } from '../components/AuthModal';

interface SettingsPageProps {
  readonly mode: 'dark' | 'light';
  readonly onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ mode, onToggleTheme }) => {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 85, 0, 0.12)',
            color: 'primary.main',
            boxShadow: 'none',
          }}
        >
          <SettingsIcon sx={{ fontSize: '1.8rem' }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "var(--font-brand, 'Syne', sans-serif)",
              letterSpacing: '0',
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
          p: 3,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.75,
          boxShadow: 'none',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
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

      {/* Account & Session Management Card */}
      <Paper
        sx={{
          p: 3,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxShadow: 'none',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
        data-testid="settings-account-card"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", letterSpacing: '-0.02em' }}>
              ATHLETE ACCOUNT & SECURITY
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Manage active session and cloud sync identity
            </Typography>
          </Box>
          {user ? (
            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: '0.85rem !important' }} />}
              label="AUTHENTICATED"
              color="success"
              size="small"
              sx={{ fontWeight: 700, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", borderRadius: '2px' }}
            />
          ) : (
            <Chip
              label="GUEST MODE"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", borderRadius: '2px' }}
            />
          )}
        </Box>

        <Divider />

        {user ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {user.email}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)" }}>
                Session ID: {user.id.substring(0, 18)}...
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={() => signOut()}
              data-testid="settings-signout-btn"
              sx={{
                fontWeight: 700,
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                borderRadius: '4px',
              }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You are currently training in Guest mode. Sign in to sync workouts and nutritional diary across devices.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<LockOutlinedIcon />}
              onClick={() => setAuthModalOpen(true)}
              data-testid="settings-signin-btn"
              sx={{
                fontWeight: 700,
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                borderRadius: '4px',
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Paper>

      {/* Auth Modal Trigger */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </ContentWrapper>
  );
};
