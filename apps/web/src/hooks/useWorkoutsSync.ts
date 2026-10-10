import { useState, useEffect, useCallback } from 'react';
import {
  getPendingOutboxItems,
  removeOutboxItems,
  enqueueOutboxItem,
} from '../lib/offlineDb';
import { queryClient } from '../lib/queryClient';
import { isStaticHost, getApiUrl } from '../services/apiConfig';

export interface SyncState {
  readonly isOnline: boolean;
  readonly isSyncing: boolean;
  readonly pendingCount: number;
  readonly lastSyncTimestamp: string | null;
  readonly flushSyncQueue: () => Promise<void>;
  readonly enqueueMutation: (
    entityType: 'session' | 'exercise' | 'set',
    entityId: string,
    action: 'UPSERT' | 'DELETE',
    payload: unknown
  ) => Promise<void>;
}

export function useWorkoutsSync(): SyncState {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | null>(null);

  const refreshPendingCount = useCallback(async () => {
    try {
      if (isStaticHost()) {
        const pending = await getPendingOutboxItems();
        if (pending.length > 0) {
          await removeOutboxItems(pending.map((item) => item.id));
        }
        setPendingCount(0);
        return;
      }
      const pending = await getPendingOutboxItems();
      setPendingCount(pending.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  const flushSyncQueue = useCallback(async () => {
    if (isStaticHost()) {
      try {
        const pending = await getPendingOutboxItems();
        if (pending.length > 0) {
          await removeOutboxItems(pending.map((item) => item.id));
        }
        setPendingCount(0);
      } catch {
        // no-op on static hosting
      }
      return;
    }

    if (!navigator.onLine || isSyncing) return;

    try {
      setIsSyncing(true);
      const pending = await getPendingOutboxItems();
      if (pending.length === 0) {
        setIsSyncing(false);
        setPendingCount(0);
        return;
      }

      // Group outbox mutations into batch payload
      const sessions = pending
        .filter((item) => item.entityType === 'session' && item.action === 'UPSERT')
        .map((item) => item.payload);
      const exercises = pending
        .filter((item) => item.entityType === 'exercise' && item.action === 'UPSERT')
        .map((item) => item.payload);
      const sets = pending
        .filter((item) => item.entityType === 'set' && item.action === 'UPSERT')
        .map((item) => item.payload);

      const payload = {
        clientSyncTimestamp: new Date().toISOString(),
        sessions,
        exercises,
        sets,
      };

      const response = await fetch(getApiUrl('/api/v1/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const itemIds = pending.map((item) => item.id);
        await removeOutboxItems(itemIds);
        setLastSyncTimestamp(new Date().toISOString());
        queryClient.invalidateQueries();
      }
    } catch {
      // Retained in outbox for subsequent retry on next network transition
    } finally {
      setIsSyncing(false);
      await refreshPendingCount();
    }
  }, [isSyncing, refreshPendingCount]);

  const enqueueMutation = useCallback(
    async (
      entityType: 'session' | 'exercise' | 'set',
      entityId: string,
      action: 'UPSERT' | 'DELETE',
      payload: unknown
    ) => {
      if (isStaticHost()) {
        setPendingCount(0);
        return;
      }
      await enqueueOutboxItem(entityType, entityId, action, payload);
      await refreshPendingCount();

      if (navigator.onLine) {
        flushSyncQueue();
      }
    },
    [flushSyncQueue, refreshPendingCount]
  );

  useEffect(() => {
    refreshPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      flushSyncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushSyncQueue, refreshPendingCount]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTimestamp,
    flushSyncQueue,
    enqueueMutation,
  };
}
