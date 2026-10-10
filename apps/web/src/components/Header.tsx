import React from 'react';
import { Box, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HeaderBar,
  BrandGroup,
  BrandLogoContainer,
  BrandTitle,
  NavLinksGroup,
  NavButton,
} from './styled';
import { SyncStatusBadge } from './SyncStatusBadge';

// Minimalist Geometric Dumbbell Logo
export const DumbbellLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="IronPulse Dumbbell Logo"
  >
    {/* Center Bar */}
    <rect x="7" y="14" width="18" height="4" rx="2" fill="#10B981" />
    {/* Inner Plates */}
    <rect x="5" y="10" width="3" height="12" rx="1.5" fill="#10B981" />
    <rect x="24" y="10" width="3" height="12" rx="1.5" fill="#10B981" />
    {/* Outer Plates */}
    <rect x="2" y="12" width="2" height="8" rx="1" fill="#64748B" />
    <rect x="28" y="12" width="2" height="8" rx="1" fill="#64748B" />
  </svg>
);

interface HeaderProps {
  readonly mode: 'dark' | 'light';
  readonly onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onToggleTheme }) => {
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const navItems = [
    { label: 'TRACKER', path: '/' },
    { label: 'NUTRITION', path: '/nutrition' },
    { label: 'FOOD INTEL', path: '/food-intel' },
    { label: 'HISTORY', path: '/history' },
    { label: 'EXERCISES', path: '/exercises' },
    { label: 'ANALYTICS', path: '/analytics' },
    { label: 'SETTINGS', path: '/settings' },
  ];

  return (
    <Box component="header">
      <HeaderBar>
        {/* Brand Section */}
        <BrandGroup>
          <BrandLogoContainer onClick={() => navigate('/')}>
            <DumbbellLogo size={34} />
          </BrandLogoContainer>
          <Box>
            <BrandTitle variant="h5">IRONPULSE</BrandTitle>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              TRAINING SESSION TRACKER
            </Typography>
          </Box>
        </BrandGroup>

        {/* Date Badge & Theme Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SyncStatusBadge />
          <Chip
            icon={<CalendarTodayIcon sx={{ fontSize: '0.85rem !important' }} />}
            label={today}
            size="small"
            variant="outlined"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderColor: 'divider',
              fontSize: '0.72rem',
            }}
          />

          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={onToggleTheme}
              id="theme-toggle-btn"
              aria-label="Toggle theme"
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  borderColor: 'primary.main',
                },
              }}
            >
              {isDark ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </HeaderBar>

      {/* Route Navigation Bar */}
      <NavLinksGroup sx={{ mt: 1, px: 0.25 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavButton
              key={item.path}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}-btn`}
              active={isActive}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </NavButton>
          );
        })}
      </NavLinksGroup>
    </Box>
  );
};
