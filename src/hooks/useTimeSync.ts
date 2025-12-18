/**
 * useTimeSync - Time synchronization hook for server-client time alignment
 *
 * Purpose:
 * Mobile devices can have incorrect system clocks. This hook ensures
 * reservation countdowns are accurate by syncing with server time.
 *
 * Strategy:
 * 1. On mount: Fetch server time and calculate offset
 * 2. Periodically: Re-sync every 5 minutes (configurable)
 * 3. On network reconnect: Re-sync immediately
 *
 * For this assessment, we simulate server time. In production:
 * - Call a /time or /health endpoint that returns server timestamp
 * - Use NTP-style averaging for more accuracy if needed
 */

import {useEffect, useCallback, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useAppDispatch} from '../store';
import {syncTime} from '@slices/cart';

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface UseTimeSyncOptions {
  autoSync?: boolean;
  syncIntervalMs?: number;
}

/**
 * Simulates a server time fetch
 * In production, replace with actual API call:
 *
 * const fetchServerTime = async (): Promise<number> => {
 *   const response = await fetch('/api/time');
 *   const { serverTime } = await response.json();
 *   return serverTime;
 * };
 */
const fetchServerTime = async (): Promise<number> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 50));

  // In production, this would be the actual server timestamp
  // For demo purposes, we use Date.now() (simulating perfect sync)
  // You could add artificial drift here for testing:
  // return Date.now() + 5000; // Server is 5 seconds ahead
  return Date.now();
};

export const useTimeSync = (options: UseTimeSyncOptions = {}) => {
  const {autoSync = true, syncIntervalMs = SYNC_INTERVAL_MS} = options;

  const dispatch = useAppDispatch();
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  /**
   * Perform time synchronization
   */
  const performSync = useCallback(async () => {
    try {
      const localTimeBefore = Date.now();
      const serverTime = await fetchServerTime();
      const localTimeAfter = Date.now();

      // Use midpoint of request to account for network latency
      const localTimestamp = Math.floor((localTimeBefore + localTimeAfter) / 2);

      dispatch(
        syncTime({
          serverTimestamp: serverTime,
          localTimestamp,
        }),
      );

      return true;
    } catch (error) {
      console.warn('Time sync failed:', error);
      return false;
    }
  }, [dispatch]);

  /**
   * Handle app state changes
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground - sync time
        performSync();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [performSync]);

  /**
   * Handle network reconnection
   */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        // Network became available - sync time
        performSync();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [performSync]);

  /**
   * Set up periodic sync
   */
  useEffect(() => {
    if (!autoSync) return;

    // Initial sync
    performSync();

    // Periodic sync
    syncIntervalRef.current = setInterval(performSync, syncIntervalMs);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [autoSync, syncIntervalMs, performSync]);

  return {
    syncNow: performSync,
  };
};
