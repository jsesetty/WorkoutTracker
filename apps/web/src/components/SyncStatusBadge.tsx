import React from 'react';
import { Chip, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import SyncIcon from '@mui/icons-material/Sync';
import { useWorkoutsSync } from '../hooks/useWorkoutsSync';

export const SyncStatusBadge: React.FC = () => {
  const { isOnline, isSyncing, pendingCount, flushSyncQueue } = useWorkoutsSync();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isOnline) {
    const label = pendingCount > 0
      ? (isMobile ? `${pendingCount}` : `OFFLINE (${pendingCount})`)
      : (isMobile ? '!' : 'OFFLINE');
    return (
      <Tooltip title="Working offline. Changes are saved locally and will auto-sync once connection is restored.">
        <Chip
          id="sync-status-badge"
          icon={<CloudOffIcon fontSize="small" />}
          label={label}
          size="small"
          color="warning"
          variant="outlined"
          sx={{
            fontWeight: 700,
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            height: 24,
            px: isMobile ? 0.25 : 0.75,
          }}
          onClick={flushSyncQueue}
        />
      </Tooltip>
    );
  }

  if (isSyncing) {
    return (
      <Tooltip title="Synchronizing offline mutations with cloud database...">
        <Chip
          id="sync-status-badge"
          icon={<SyncIcon fontSize="small" sx={{ animation: 'spin 1.2s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />}
          label={isMobile ? undefined : 'SYNCING'}
          size="small"
          color="info"
          variant="outlined"
          sx={{
            fontWeight: 700,
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
            height: 24,
            px: isMobile ? 0.25 : 0.75,
          }}
        />
      </Tooltip>
    );
  }

  const onlineLabel = pendingCount > 0
    ? (isMobile ? `${pendingCount}` : `SYNC PENDING (${pendingCount})`)
    : (isMobile ? undefined : 'SYNCED');

  return (
    <Tooltip title={pendingCount > 0 ? `${pendingCount} changes waiting to sync. Click to retry.` : 'All workouts and telemetry are in sync.'}>
      <Chip
        id="sync-status-badge"
        icon={<CloudDoneIcon fontSize="small" />}
        label={onlineLabel}
        size="small"
        color={pendingCount > 0 ? 'warning' : 'success'}
        variant="outlined"
        sx={{
          fontWeight: 700,
          fontSize: '0.68rem',
          letterSpacing: '0.04em',
          cursor: pendingCount > 0 ? 'pointer' : 'default',
          height: 24,
          px: isMobile ? 0.25 : 0.75,
        }}
        onClick={pendingCount > 0 ? flushSyncQueue : undefined}
      />
    </Tooltip>
  );
};
