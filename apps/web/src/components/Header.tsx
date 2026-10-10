import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HeaderBar,
  BrandGroup,
  BrandLogoContainer,
  BrandTitle,
  NavLinksGroup,
  NavButton,
  UserAvatarButton,
} from './styled';
import { SyncStatusBadge } from './SyncStatusBadge';
import { useAuth } from '../auth/AuthProvider';
import { AuthModal } from './AuthModal';

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
    <rect x="7" y="14" width="18" height="4" rx="1" fill="#FF5500" />
    {/* Inner Plates */}
    <rect x="5" y="10" width="3" height="12" rx="1" fill="#FF5500" />
    <rect x="24" y="10" width="3" height="12" rx="1" fill="#FF5500" />
    {/* Outer Plates */}
    <rect x="2" y="12" width="2" height="8" rx="1" fill="#5E697A" />
    <rect x="28" y="12" width="2" height="8" rx="1" fill="#5E697A" />
  </svg>
);

interface HeaderProps {
  readonly mode: 'dark' | 'light';
  readonly onToggleTheme: () => void;
  readonly onShowNotification?: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onToggleTheme, onShowNotification }) => {
  const isDark = mode === 'dark';
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut();
    onShowNotification?.('Signed out successfully. Session cache cleared.', 'info');
  };

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

        {/* Date Badge, Theme Toggle & Auth Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SyncStatusBadge />

          <Chip
            icon={<CalendarTodayIcon sx={{ fontSize: '0.85rem !important' }} />}
            label={today}
            size="small"
            variant="outlined"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
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

          {/* User Auth Action (Sign In vs Avatar Menu) */}
          {user ? (
            <>
              <UserAvatarButton
                onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
                data-testid="header-user-btn"
                aria-label="user profile menu"
              >
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    bgcolor: 'primary.main',
                    color: '#0A0F1D',
                  }}
                >
                  {user.email ? user.email[0].toUpperCase() : 'A'}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    maxWidth: { xs: 80, sm: 130 },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: { xs: 'none', sm: 'inline' },
                  }}
                >
                  {user.email}
                </Typography>
              </UserAvatarButton>

              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleMenuClose}
                data-testid="header-user-menu"
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: '4px',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? '#181D26' : theme.palette.background.paper,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 4px 16px rgba(0,0,0,0.6)'
                        : '0 4px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: '0.75rem !important' }} />}
                      label="ATHLETE"
                      size="small"
                      color="success"
                      sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, borderRadius: '2px' }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/settings');
                  }}
                  sx={{ fontSize: '0.85rem', gap: 1 }}
                >
                  <SettingsIcon fontSize="small" color="action" />
                  Account & Settings
                </MenuItem>

                <MenuItem
                  onClick={handleSignOut}
                  data-testid="header-logout-btn"
                  sx={{
                    fontSize: '0.85rem',
                    gap: 1,
                    color: 'error.main',
                    fontWeight: 600,
                  }}
                >
                  <LogoutIcon fontSize="small" color="error" />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<LoginIcon />}
              onClick={() => setAuthModalOpen(true)}
              data-testid="header-signin-btn"
              sx={{
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: '4px',
                py: 0.5,
                px: 1.25,
              }}
            >
              SIGN IN
            </Button>
          )}
        </Box>
      </HeaderBar>

      {/* Route Navigation Bar (Visible on Mobile/Tablet viewports below lg breakpoint) */}
      {!isDesktop && (
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
      )}

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onShowNotification={onShowNotification}
      />
    </Box>
  );
};
