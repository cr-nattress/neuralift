'use client';

/**
 * useDataSync Hook
 *
 * Provides access to the data sync service for components that need
 * to display sync status or trigger manual syncs.
 */

import { useEffect, useState, useCallback } from 'react';
import { dataSyncService, type SyncState } from '@/infrastructure/sync';

export interface UseDataSyncReturn {
  /** Current sync state */
  state: SyncState;
  /** Whether sync is in progress */
  isSyncing: boolean;
  /** Whether app is offline */
  isOffline: boolean;
  /** Whether there are pending changes */
  hasPendingChanges: boolean;
  /** Trigger a manual sync */
  sync: () => Promise<boolean>;
  /** Mark that there are pending changes */
  markPendingChanges: () => void;
}

export function useDataSync(): UseDataSyncReturn {
  const [state, setState] = useState<SyncState>(dataSyncService.getState());

  useEffect(() => {
    // Subscribe to sync state changes
    const unsubscribe = dataSyncService.subscribe(setState);

    // Initialize on first mount (idempotent)
    void dataSyncService.initialize();

    return () => {
      unsubscribe();
    };
  }, []);

  const sync = useCallback(async () => {
    return dataSyncService.sync();
  }, []);

  const markPendingChanges = useCallback(() => {
    dataSyncService.markPendingChanges();
  }, []);

  return {
    state,
    isSyncing: state.status === 'syncing',
    isOffline: state.status === 'offline',
    hasPendingChanges: state.pendingChanges > 0,
    sync,
    markPendingChanges,
  };
}
