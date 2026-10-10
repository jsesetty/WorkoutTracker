import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../auth/AuthProvider';
import { AuthContainerBox } from './styled';

export interface AuthModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onShowNotification?: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onShowNotification,
}) => {
  const { isConfigured, signInWithEmail, signUpWithEmail, demoLogin } = useAuth();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setFormError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithEmail(email.trim(), password);
      if (error) {
        setFormError(error.message);
        return;
      }
      onShowNotification?.(`Signed in successfully as ${email.trim()}`, 'success');
      handleClose();
    } catch (err) {
      setFormError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUpWithEmail(email.trim(), password);
      if (error) {
        setFormError(error.message);
        return;
      }
      onShowNotification?.(`Account created! Welcome to IronPulse, ${email.trim()}`, 'success');
      handleClose();
    } catch (err) {
      setFormError('An unexpected registration error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAthlete = async () => {
    setLoading(true);
    setFormError(null);
    try {
      await demoLogin('demo.athlete@ironpulse.fit');
      onShowNotification?.('Authenticated as Demo Athlete (demo.athlete@ironpulse.fit)', 'success');
      handleClose();
    } catch {
      setFormError('Failed to initialize demo athlete session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundImage: 'none',
        },
      }}
      data-testid="auth-modal"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockOutlinedIcon color="primary" sx={{ fontSize: '1.5rem' }} />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.05rem',
                lineHeight: 1.2,
              }}
            >
              IRONPULSE ATHLETE ACCESS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isConfigured ? 'Supabase cloud sync enabled' : 'Local preview & demo mode active'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" aria-label="close auth dialog">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        {/* Sign In vs Sign Up Tabs */}
        <Box
          sx={{
            display: 'flex',
            borderRadius: '8px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            p: 0.5,
          }}
        >
          <Button
            fullWidth
            size="small"
            onClick={() => {
              setTab('signin');
              setFormError(null);
            }}
            data-testid="auth-tab-signin"
            variant={tab === 'signin' ? 'contained' : 'text'}
            color={tab === 'signin' ? 'primary' : 'inherit'}
            sx={{
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              borderRadius: '6px',
            }}
          >
            SIGN IN
          </Button>
          <Button
            fullWidth
            size="small"
            onClick={() => {
              setTab('signup');
              setFormError(null);
            }}
            data-testid="auth-tab-signup"
            variant={tab === 'signup' ? 'contained' : 'text'}
            color={tab === 'signup' ? 'primary' : 'inherit'}
            sx={{
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              borderRadius: '6px',
            }}
          >
            CREATE ACCOUNT
          </Button>
        </Box>

        {/* Error Alert */}
        {formError && (
          <Alert severity="error" onClose={() => setFormError(null)}>
            {formError}
          </Alert>
        )}

        {/* Form Inputs */}
        <AuthContainerBox
          noValidate
          data-testid="auth-form"
          onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}
        >
          <TextField
            label="Athlete Email"
            type="email"
            size="small"
            fullWidth
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ 'data-testid': 'auth-email-input' }}
            placeholder="athlete@ironpulse.fit"
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            size="small"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ 'data-testid': 'auth-password-input' }}
            placeholder="Enter password..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {tab === 'signup' && (
            <TextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              size="small"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{ 'data-testid': 'auth-confirm-password-input' }}
              placeholder="Confirm your password..."
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : tab === 'signin' ? (
                <LoginIcon />
              ) : (
                <PersonAddOutlinedIcon />
              )
            }
            data-testid="auth-submit-btn"
            sx={{
              mt: 1,
              py: 1,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
            }}
          >
            {tab === 'signin' ? 'ENTER TRAINING HUD' : 'REGISTER ATHLETE'}
          </Button>
        </AuthContainerBox>

        <Divider sx={{ my: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* Quick Demo Athlete Login */}
        <Button
          variant="outlined"
          color="success"
          fullWidth
          onClick={handleDemoAthlete}
          disabled={loading}
          startIcon={<BoltIcon />}
          data-testid="auth-demo-btn"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '8px',
          }}
        >
          ⚡ QUICK DEMO ATHLETE LOGIN
        </Button>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
          Protected by Supabase GoTrue JWT & Offline-Resilient Storage
        </Typography>
      </DialogActions>
    </Dialog>
  );
};
