/**
 * Cart Slice - Redux state management for Reserved Cart feature
 *
 * Architecture Highlights:
 * 1. Server-Authoritative Time: All expiration calculations use server time
 * 2. Time Drift Compensation: serverTimeOffset tracks difference between server and local clocks
 * 3. Persistence-Safe: Cart items store both server and local timestamps for accurate recovery
 * 4. Scalable Design: O(n) operations optimized for 100+ items with different timers
 *
 * Time Synchronization Strategy:
 * - On app start, sync with server to get serverTimeOffset
 * - Each cart item has: serverReservedAt, localReservedAt, expiresAt
 * - getRemainingTime() uses: expiresAt - (Date.now() + serverTimeOffset)
 * - This ensures accurate countdowns even after app restarts or network issues
 */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  CartState,
  CartItem,
  AddToCartPayload,
  RemoveFromCartPayload,
  UpdateQuantityPayload,
  SyncTimePayload,
  ReservationTimeInfo,
} from '@types';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const DEFAULT_RESERVATION_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const initialState: CartState = {
  items: [],
  lastSyncedAt: null,
  serverTimeOffset: 0, // Positive = server ahead, Negative = server behind
  isLoading: false,
  error: null,
};

/**
 * Calculate the current server time based on local time and offset
 */
export const getCurrentServerTime = (serverTimeOffset: number): number => {
  return Date.now() + serverTimeOffset;
};

/**
 * Calculate remaining time for a cart item
 * This is a pure function that can be used anywhere
 */
export const calculateRemainingTime = (
  item: CartItem,
  serverTimeOffset: number,
): ReservationTimeInfo => {
  const currentServerTime = getCurrentServerTime(serverTimeOffset);
  const remainingMs = Math.max(0, item.expiresAt - currentServerTime);
  const remainingSeconds = Math.floor(remainingMs / 1000);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const isExpired = remainingMs <= 0;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;

  return {
    remainingMs,
    remainingSeconds,
    remainingMinutes,
    isExpired,
    formattedTime,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Sync time with server
     * Should be called on app start and periodically
     */
    syncTime: (state, action: PayloadAction<SyncTimePayload>) => {
      const {serverTimestamp, localTimestamp} = action.payload;
      state.serverTimeOffset = serverTimestamp - localTimestamp;
      state.lastSyncedAt = serverTimestamp;
    },

    /**
     * Add item to cart with reservation
     * Server timestamp is required to ensure accurate time tracking
     */
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const {
        product,
        quantity = 1,
        serverTimestamp,
        reservationDurationMs = DEFAULT_RESERVATION_DURATION_MS,
      } = action.payload;

      // Check if product already exists in cart
      const existingItem = state.items.find(
        item => item.product.id === product.id && !item.isExpired,
      );

      if (existingItem) {
        // Update quantity instead of adding duplicate
        existingItem.quantity += quantity;
        return;
      }

      const localTimestamp = Date.now();
      const expiresAt = serverTimestamp + reservationDurationMs;

      const newItem: CartItem = {
        id: uuidv4(),
        product,
        quantity,
        serverReservedAt: serverTimestamp,
        localReservedAt: localTimestamp,
        reservationDurationMs,
        expiresAt,
        isExpired: false,
      };

      state.items.push(newItem);
    },

    /**
     * Remove item from cart
     */
    removeFromCart: (state, action: PayloadAction<RemoveFromCartPayload>) => {
      const {cartItemId} = action.payload;
      state.items = state.items.filter(item => item.id !== cartItemId);
    },

    /**
     * Update item quantity
     */
    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const {cartItemId, quantity} = action.payload;
      const item = state.items.find(i => i.id === cartItemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== cartItemId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    /**
     * Mark item as expired
     * Called when timer reaches zero
     */
    markAsExpired: (state, action: PayloadAction<string>) => {
      const cartItemId = action.payload;
      const item = state.items.find(i => i.id === cartItemId);
      if (item) {
        item.isExpired = true;
      }
    },

    /**
     * Remove all expired items from cart
     * Called after user acknowledges expiration or on checkout
     */
    removeExpiredItems: state => {
      state.items = state.items.filter(item => !item.isExpired);
    },

    /**
     * Check all items for expiration
     * Should be called periodically or on app foreground
     */
    checkExpirations: state => {
      const currentServerTime = getCurrentServerTime(state.serverTimeOffset);

      state.items.forEach(item => {
        if (!item.isExpired && item.expiresAt <= currentServerTime) {
          item.isExpired = true;
        }
      });
    },

    /**
     * Clear entire cart
     */
    clearCart: state => {
      state.items = [];
    },

    /**
     * Restore cart from persistence
     * Recalculates expiration status based on current time
     */
    restoreCart: (state, action: PayloadAction<CartItem[]>) => {
      const restoredItems = action.payload;
      const currentServerTime = getCurrentServerTime(state.serverTimeOffset);

      // Recalculate expiration status for each item
      state.items = restoredItems.map(item => ({
        ...item,
        isExpired: item.expiresAt <= currentServerTime,
      }));
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  syncTime,
  addToCart,
  removeFromCart,
  updateQuantity,
  markAsExpired,
  removeExpiredItems,
  checkExpirations,
  clearCart,
  restoreCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: {cart: CartState}) =>
  state.cart.items.filter(item => !item.isExpired);

export const selectExpiredItems = (state: {cart: CartState}) =>
  state.cart.items.filter(item => item.isExpired);

export const selectAllCartItems = (state: {cart: CartState}) => state.cart.items;

export const selectCartItemCount = (state: {cart: CartState}) =>
  state.cart.items.filter(item => !item.isExpired).reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: {cart: CartState}) =>
  state.cart.items
    .filter(item => !item.isExpired)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const selectServerTimeOffset = (state: {cart: CartState}) =>
  state.cart.serverTimeOffset;

export const selectItemById = (state: {cart: CartState}, cartItemId: string) =>
  state.cart.items.find(item => item.id === cartItemId);
