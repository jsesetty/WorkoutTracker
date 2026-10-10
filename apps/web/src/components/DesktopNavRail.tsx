import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoginIcon from '@mui/icons-material/Login';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ConsoleLeftRail,
  RailCard,
  RailSectionTitle,
  StationRailBtn,
} from './styled';
import { SyncStatusBadge } from './SyncStatusBadge';
import { useAuth } from '../auth/AuthProvider';

interface DesktopNavRailProps {
  readonly mode: 'dark' | 'light';
  readonly onToggleTheme: () => void;
  readonly onOpenAIModal?: () => void;
  readonly onOpenAuthModal?: () => void;
}

export const DesktopNavRail: React.FC<DesktopNavRailProps> = ({
  mode,
  onToggleTheme,
  onOpenAIModal,
  onOpenAuthModal,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isDark = mode === 'dark';

  const navItems = [
    { label: 'TRACKER', path: '/', icon: <FitnessCenterIcon sx={{ fontSize: '1.1rem' }} />, key: '1' },
    { label: 'NUTRITION', path: '/nutrition', icon: <RestaurantMenuIcon sx={{ fontSize: '1.1rem' }} />, key: '2' },
    { label: 'FOOD INTEL', path: '/food-intel', icon: <QrCodeScannerIcon sx={{ fontSize: '1.1rem' }} />, key: '3' },
    { label: 'HISTORY', path: '/history', icon: <HistoryIcon sx={{ fontSize: '1.1rem' }} />, key: '4' },
    { label: 'EXERCISES', path: '/exercises', icon: <LibraryBooksIcon sx={{ fontSize: '1.1rem' }} />, key: '5' },
    { label: 'ANALYTICS', path: '/analytics', icon: <InsightsIcon sx={{ fontSize: '1.1rem' }} />, key: '6' },
    { label: 'SETTINGS', path: '/settings', icon: <SettingsIcon sx={{ fontSize: '1.1rem' }} />, key: '7' },
  ];

  return (
    <ConsoleLeftRail aria-label="Console Station Navigation">
      {/* Station Navigation Rail */}
      <RailCard elevation={0}>
        <RailSectionTitle>
          <span>STATION DIRECTORY</span>
          <Chip
            label="COMMAND"
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const buttonId = `nav-${item.label.toLowerCase().replace(/\s+/g, '-')}-btn`;
            return (
              <StationRailBtn
                key={item.path}
                id={buttonId}
                active={isActive}
                onClick={() => navigate(item.path)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <span>{item.label}</span>
                </Box>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                    fontSize: '0.68rem',
                    color: isActive ? '#FF5500' : 'text.secondary',
                    opacity: 0.7,
                  }}
                >
                  [{item.key}]
                </Typography>
              </StationRailBtn>
            );
          })}
        </Box>
      </RailCard>

      {/* Quick Launch & AI Utility */}
      <RailCard elevation={0}>
        <RailSectionTitle>
          <span>QUICK OPERATIONS</span>
        </RailSectionTitle>

        {onOpenAIModal && (
          <Button
            id="rail-ai-quick-btn"
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={onOpenAIModal}
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '4px',
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              py: 0.8,
            }}
          >
            ⚡ AI QUICK LOG
          </Button>
        )}

        <Button
          id="rail-theme-toggle-btn"
          variant="outlined"
          color="inherit"
          fullWidth
          size="small"
          onClick={onToggleTheme}
          startIcon={isDark ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          sx={{
            borderColor: 'divider',
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.72rem',
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        >
          {isDark ? 'LIGHT CHALK' : 'OBSIDIAN VOID'}
        </Button>
      </RailCard>

      {/* Athlete Status & Cloud Synchronization */}
      <RailCard elevation={0}>
        <RailSectionTitle>
          <span>ATHLETE TELEMETRY</span>
          <SyncStatusBadge />
        </RailSectionTitle>

        {user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  bgcolor: 'primary.main',
                  color: '#0A0F1D',
                  borderRadius: '4px',
                }}
              >
                {user.email ? user.email[0].toUpperCase() : 'A'}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'text.primary',
                    fontSize: '0.75rem',
                  }}
                >
                  {user.email}
                </Typography>
                <Chip
                  icon={<VerifiedUserIcon sx={{ fontSize: '0.7rem !important' }} />}
                  label="PRO ATHLETE"
                  size="small"
                  color="success"
                  sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, borderRadius: '2px', mt: 0.25 }}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
              Training in local Guest mode. Sync state to cloud:
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              fullWidth
              startIcon={<LoginIcon />}
              onClick={onOpenAuthModal}
              sx={{
                fontWeight: 700,
                fontSize: '0.72rem',
                borderRadius: '4px',
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              }}
            >
              SIGN IN
            </Button>
          </Box>
        )}
      </RailCard>
    </ConsoleLeftRail>
  );
};
