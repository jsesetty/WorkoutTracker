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
  Drawer,
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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HeaderBar,
  BrandGroup,
  BrandLogoContainer,
  BrandTitle,
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
  readonly onOpenAIModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleTheme,
  onShowNotification,
  onOpenAIModal,
}) => {
  const isDark = mode === 'dark';
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const navItems = [
    { label: 'TRACKER', path: '/', icon: <FitnessCenterIcon sx={{ fontSize: '1.1rem' }} /> },
    { label: 'NUTRITION', path: '/nutrition', icon: <RestaurantMenuIcon sx={{ fontSize: '1.1rem' }} /> },
    { label: 'FOOD INTEL', path: '/food-intel', icon: <QrCodeScannerIcon sx={{ fontSize: '1.1rem' }} /> },
    { label: 'HISTORY', path: '/history', icon: <HistoryIcon sx={{ fontSize: '1.1rem' }} /> },
    { label: 'EXERCISES', path: '/exercises', icon: <LibraryBooksIcon sx={{ fontSize: '1.1rem' }} /> },
    { label: 'ANALYTICS', path: '/analytics', icon: <InsightsIcon sx={{ fontSize: '1.1rem' }} /> },
    { label: 'SETTINGS', path: '/settings', icon: <SettingsIcon sx={{ fontSize: '1.1rem' }} /> },
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
    <Box component="header" sx={{ width: '100%', maxWidth: '100%' }}>
      <HeaderBar>
        {/* Brand Section */}
        <BrandGroup>
          <BrandLogoContainer onClick={() => navigate('/')}>
            <DumbbellLogo size={isMobile ? 26 : 34} />
          </BrandLogoContainer>
          <Box>
            <BrandTitle variant="h5">IRONPULSE</BrandTitle>
            <Typography
              variant="caption"
              sx={{
                display: { xs: 'none', md: 'block' },
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

        {/* Date Badge, Theme Toggle, Auth & Hamburger Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
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
                p: { xs: 0.5, sm: 0.75 },
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

          {/* User Auth Action (Sign In vs Avatar Menu) - Visible on Tablet/Desktop sm+ */}
          <Box sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignItems: 'center' }}>
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
                      maxWidth: { sm: 110, md: 150 },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline',
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
                startIcon={<LoginIcon sx={{ fontSize: '0.95rem' }} />}
                onClick={() => setAuthModalOpen(true)}
                data-testid="header-signin-btn"
                sx={{
                  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  py: 0.5,
                  px: 1.25,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  '& .MuiButton-startIcon': {
                    mr: 0.75,
                    ml: 0,
                  },
                }}
              >
                SIGN IN
              </Button>
            )}
          </Box>

          {/* Mobile/Tablet Hamburger Menu Button - Visible below lg (when DesktopNavRail is hidden) */}
          {!isDesktop && (
            <Tooltip title="Open Station Navigation">
              <IconButton
                id="mobile-nav-hamburger-btn"
                aria-label="Open Navigation Menu"
                onClick={() => setDrawerOpen(true)}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: (theme) =>
                    drawerOpen ? theme.palette.primary.main : theme.palette.divider,
                  p: { xs: 0.5, sm: 0.75 },
                  color: drawerOpen ? 'primary.main' : 'text.primary',
                  backgroundColor: drawerOpen
                    ? (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 85, 0, 0.12)'
                          : 'rgba(255, 85, 0, 0.08)'
                    : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                  },
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </HeaderBar>

      {/* Mobile/Tablet Station Navigation Drawer */}
      {!isDesktop && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '84vw', sm: 320 },
              maxWidth: 320,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
              backgroundImage: 'none',
              borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            },
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1.5,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DumbbellLogo size={26} />
              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-brand, 'Syne', sans-serif)",
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    letterSpacing: '0',
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                  }}
                >
                  IRONPULSE
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  STATION DIRECTORY // RIG
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              size="small"
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                p: 0.5,
                '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Athlete Identity / Auth Pod in Mobile Drawer */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '4px',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#181D26' : 'rgba(0, 0, 0, 0.02)',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      bgcolor: 'primary.main',
                      color: '#0A0F1D',
                    }}
                  >
                    {user.email ? user.email[0].toUpperCase() : 'A'}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.email}
                    </Typography>
                    <Chip
                      label="PRO ATHLETE"
                      size="small"
                      color="success"
                      sx={{ height: 16, fontSize: '0.58rem', fontWeight: 800, borderRadius: '2px' }}
                    />
                  </Box>
                </Box>

                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setDrawerOpen(false);
                    handleSignOut();
                  }}
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    minWidth: 'auto',
                    p: '2px 6px',
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    fontSize: '0.68rem',
                  }}
                >
                  ATHLETE SESSION: GUEST
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="small"
                  startIcon={<LoginIcon />}
                  onClick={() => {
                    setDrawerOpen(false);
                    setAuthModalOpen(true);
                  }}
                  data-testid="drawer-signin-btn"
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    py: 0.75,
                  }}
                >
                  SIGN IN // ATHLETE LOGIN
                </Button>
              </Box>
            )}
          </Box>

          {/* Command Stations List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1, overflowY: 'auto' }}>
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'text.secondary',
                textTransform: 'uppercase',
                px: 0.5,
                mb: 0.25,
              }}
            >
              COMMAND STATIONS
            </Typography>

            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const buttonId = `mobile-drawer-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}-btn`;
              return (
                <Button
                  key={item.path}
                  id={buttonId}
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    color: isActive ? '#FF5500' : 'text.primary',
                    backgroundColor: isActive
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 85, 0, 0.12)'
                            : 'rgba(255, 85, 0, 0.08)'
                      : 'transparent',
                    border: (theme) =>
                      `1px solid ${isActive ? 'rgba(255, 85, 0, 0.35)' : theme.palette.divider}`,
                    transition: 'all 0.1s ease-out',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.04)'
                          : 'rgba(0, 0, 0, 0.04)',
                      color: '#FF5500',
                      borderColor: '#FF5500',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Box>
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                      fontSize: '0.68rem',
                      color: isActive ? '#FF5500' : 'text.secondary',
                      fontWeight: 600,
                    }}
                  >
                    [0{index + 1}]
                  </Typography>
                </Button>
              );
            })}
          </Box>

          {/* Quick AI Action Pod */}
          {onOpenAIModal && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<AutoAwesomeIcon />}
              onClick={() => {
                setDrawerOpen(false);
                onOpenAIModal();
              }}
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '0.78rem',
                borderRadius: '4px',
                py: 0.75,
                borderColor: 'rgba(255, 85, 0, 0.4)',
              }}
            >
              ⚡ AI QUICK LOG
            </Button>
          )}

          {/* Footer Build Spec */}
          <Box
            sx={{
              pt: 1,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
                fontSize: '0.62rem',
                color: 'text.secondary',
              }}
            >
              RIG v1.0 // CYBER-ATHLETIC
            </Typography>
            <Chip
              label="ONLINE"
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 16, fontSize: '0.58rem', fontWeight: 800, borderRadius: '2px' }}
            />
          </Box>
        </Drawer>
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
