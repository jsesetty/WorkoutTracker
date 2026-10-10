import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { SyncStatusBadge } from '../SyncStatusBadge';
import { getGymTheme } from '../../theme';
import { generateClientUUID } from '../../lib/offlineDb';

describe('SyncStatusBadge & Offline Utilities', () => {
  test('generates valid RFC4122 v4 UUIDs for client-side offline idempotency', () => {
    const uuid = generateClientUUID();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  test('renders online synced status by default', () => {
    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <SyncStatusBadge />
      </ThemeProvider>
    );

    const badge = screen.getByText(/SYNCED/i);
    expect(badge).toBeInTheDocument();
  });
});
