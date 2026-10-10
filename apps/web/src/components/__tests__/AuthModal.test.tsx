import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { AuthModal } from '../AuthModal';
import { getGymTheme } from '../../theme';
import { AuthProvider } from '../../auth/AuthProvider';

describe('AuthModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderModal = (open = true, onClose = jest.fn(), onShowNotification = jest.fn()) => {
    return render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <AuthProvider>
          <AuthModal open={open} onClose={onClose} onShowNotification={onShowNotification} />
        </AuthProvider>
      </ThemeProvider>
    );
  };

  test('renders Sign In tab, inputs, and demo button when opened', () => {
    renderModal(true);

    expect(screen.getByText(/IRONPULSE ATHLETE ACCESS/i)).toBeInTheDocument();
    expect(screen.getByTestId('auth-tab-signin')).toBeInTheDocument();
    expect(screen.getByTestId('auth-tab-signup')).toBeInTheDocument();
    expect(screen.getByTestId('auth-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('auth-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('auth-submit-btn')).toHaveTextContent(/ENTER TRAINING HUD/i);
    expect(screen.getByTestId('auth-demo-btn')).toBeInTheDocument();
  });

  test('validates email format and displays error alert when email is invalid', async () => {
    renderModal(true);

    const emailInput = screen.getByTestId('auth-email-input');
    const form = screen.getByTestId('auth-form');

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('switches to Create Account tab and validates password match and minimum length', async () => {
    renderModal(true);

    const signupTab = screen.getByTestId('auth-tab-signup');
    fireEvent.click(signupTab);

    expect(screen.getByTestId('auth-submit-btn')).toHaveTextContent(/REGISTER ATHLETE/i);
    expect(screen.getByTestId('auth-confirm-password-input')).toBeInTheDocument();

    const emailInput = screen.getByTestId('auth-email-input');
    const passInput = screen.getByTestId('auth-password-input');
    const confirmInput = screen.getByTestId('auth-confirm-password-input');
    const form = screen.getByTestId('auth-form');

    // Test password too short
    fireEvent.change(emailInput, { target: { value: 'athlete@example.com' } });
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();
    });

    // Test password mismatch
    fireEvent.change(passInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('executes Quick Demo Athlete Login and triggers success callback', async () => {
    const onCloseMock = jest.fn();
    const onNotifyMock = jest.fn();
    renderModal(true, onCloseMock, onNotifyMock);

    const demoBtn = screen.getByTestId('auth-demo-btn');
    fireEvent.click(demoBtn);

    await waitFor(() => {
      expect(onNotifyMock).toHaveBeenCalledWith(
        expect.stringContaining('demo.athlete@ironpulse.fit'),
        'success'
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
