/**
 * useReservationTimers - Efficient multi-timer management for cart reservations
 *
 * Architecture Highlights:
 * 1. Single Timer Pattern: Uses ONE setInterval to manage ALL countdowns
 *    - Avoids n timers for n items (which would be O(n) intervals)
 *    - Single 1-second tick recalculates all remaining times
 *
 * 2. Memoized Calculations: Uses useMemo to avoid recalculating unchanged items
 *
 * 3. AppState Awareness: Handles background/foreground transitions
 *    - Recalculates on app foreground to account for elapsed time
 *    - Pauses updates when app is in background (battery optimization)
 *
 * 4. Scalability: Designed to handle 100+ items efficiently
 *    - O(n) per tick, but ticks are 1 second apart
 *    - React will batch the state updates
 *
 * Usage:
 * const { timers, isAnyExpiring } = useReservationTimers(cartItems);
 * // timers is a Map<cartItemId, ReservationTimeInfo>
 */

import {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useAppSelector, useAppDispatch} from '../store';
import {
  selectAllCartItems,
  selectServerTimeOffset,
  calculateRemainingTime,
  markAsExpired,
  removeExpiredItems,
} from '@slices/cart';
import {CartItem, ReservationTimeInfo} from '@types';

interface TimerState {
  [cartItemId: string]: ReservationTimeInfo;
}

interface UseReservationTimersResult {
  timers: TimerState;
  isAnyExpiring: boolean; // True if any item has < 1 minute remaining
  expiredItemIds: string[];
  refreshTimers: () => void;
}

export const useReservationTimers = (): UseReservationTimersResult => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectAllCartItems);
  const serverTimeOffset = useAppSelector(selectServerTimeOffset);

  const [timers, setTimers] = useState<TimerState>({});
  const [tick, setTick] = useState(0); // Force re-render trigger
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Calculate all timers - this is the core calculation
   * Runs on every tick (1 second) and on app foreground
   */
  const calculateAllTimers = useCallback(() => {
    const newTimers: TimerState = {};
    const nowExpiredIds: string[] = [];

    cartItems.forEach(item => {
      if (item.isExpired) {
        // Already marked as expired, include in result but skip calculation
        newTimers[item.id] = {
          remainingMs: 0,
          remainingSeconds: 0,
          remainingMinutes: 0,
          isExpired: true,
          formattedTime: '00:00',
        };
        return;
      }

      const timeInfo = calculateRemainingTime(item, serverTimeOffset);
      newTimers[item.id] = timeInfo;

      // Track newly expired items
      if (timeInfo.isExpired) {
        nowExpiredIds.push(item.id);
      }
    });

    // Dispatch expiration actions for newly expired items
    nowExpiredIds.forEach(id => {
      dispatch(markAsExpired(id));
    });

    setTimers(newTimers);
  }, [cartItems, serverTimeOffset, dispatch]);

  /**
   * Handle app state changes (background/foreground)
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground - recalculate immediately
        calculateAllTimers();
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
  }, [calculateAllTimers]);

  /**
   * Main timer interval - single timer for all items
   */
  useEffect(() => {
    // Initial calculation
    calculateAllTimers();

    // Set up 1-second interval
    intervalRef.current = setInterval(() => {
      // Only update if app is in foreground
      if (appStateRef.current === 'active') {
        setTick(t => t + 1);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Recalculate on tick or when cart items change
   */
  useEffect(() => {
    calculateAllTimers();
  }, [tick, cartItems.length, calculateAllTimers]);

  /**
   * Manual refresh function (useful for pull-to-refresh or sync button)
   */
  const refreshTimers = useCallback(() => {
    calculateAllTimers();
  }, [calculateAllTimers]);

  /**
   * Derived state calculations
   */
  const isAnyExpiring = useMemo(() => {
    return Object.values(timers).some(
      timer => !timer.isExpired && timer.remainingSeconds < 60,
    );
  }, [timers]);

  const expiredItemIds = useMemo(() => {
    return Object.entries(timers)
      .filter(([_, timer]) => timer.isExpired)
      .map(([id]) => id);
  }, [timers]);

  return {
    timers,
    isAnyExpiring,
    expiredItemIds,
    refreshTimers,
  };
};

/**
 * Hook for a single item's timer
 * Use this when you only need one item's countdown
 */
export const useItemTimer = (
  cartItemId: string,
): ReservationTimeInfo | null => {
  const cartItems = useAppSelector(selectAllCartItems);
  const serverTimeOffset = useAppSelector(selectServerTimeOffset);
  const [timeInfo, setTimeInfo] = useState<ReservationTimeInfo | null>(null);

  const item = cartItems.find(i => i.id === cartItemId);

  useEffect(() => {
    if (!item) {
      setTimeInfo(null);
      return;
    }

    const updateTimer = () => {
      const info = calculateRemainingTime(item, serverTimeOffset);
      setTimeInfo(info);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [item, serverTimeOffset]);

  return timeInfo;
};
