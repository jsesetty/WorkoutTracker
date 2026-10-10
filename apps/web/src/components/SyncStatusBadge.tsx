import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import SyncIcon from '@mui/icons-material/Sync';
import { useWorkoutsSync } from '../hooks/useWorkoutsSync';

export const SyncStatusBadge: React.FC = () => {
  const { isOnline, isSyncing, pendingCount, flushSyncQueue } = useWorkoutsSync();

  if (!isOnline) {
    const label = pendingCount > 0 ? `OFFLINE (${pendingCount})` : 'OFFLINE';
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
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
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
          label="SYNCING"
          size="small"
          color="info"
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={pendingCount > 0 ? `${pendingCount} changes waiting to sync. Click to retry.` : 'All workouts and telemetry are in sync.'}>
      <Chip
        id="sync-status-badge"
        icon={<CloudDoneIcon fontSize="small" />}
        label={pendingCount > 0 ? `SYNC PENDING (${pendingCount})` : 'SYNCED'}
        size="small"
        color={pendingCount > 0 ? 'warning' : 'success'}
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: '0.68rem',
          letterSpacing: '0.04em',
          cursor: pendingCount > 0 ? 'pointer' : 'default',
        }}
        onClick={pendingCount > 0 ? flushSyncQueue : undefined}
      />
    </Tooltip>
  );
};
