/**
 * Cart Types for Reserved Cart Feature
 *
 * Architecture Decision: Server-authoritative time synchronization
 * - Each cart item stores serverReservedAt (server timestamp) and localReservedAt (device timestamp)
 * - This allows calculating time drift and maintaining accurate countdowns across app restarts
 * - expiresAt is computed from serverReservedAt + reservationDurationMs
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  isLimitedStock: boolean;
  stockCount?: number;
}

export interface CartItem {
  id: string; // Unique cart item ID (UUID)
  product: Product;
  quantity: number;

  // Time synchronization fields
  serverReservedAt: number; // Server timestamp when reservation was made (ms since epoch)
  localReservedAt: number; // Device timestamp when reservation was made (ms since epoch)
  reservationDurationMs: number; // Duration of reservation in milliseconds (e.g., 5 minutes = 300000)
  expiresAt: number; // Server timestamp when reservation expires (serverReservedAt + reservationDurationMs)

  // State
  isExpired: boolean;
}

export interface CartState {
  items: CartItem[];
  lastSyncedAt: number | null; // Last time we synced with server
  serverTimeOffset: number; // Difference between server time and local time (serverTime - localTime)
  isLoading: boolean;
  error: string | null;
}

// Action payloads
export interface AddToCartPayload {
  product: Product;
  quantity?: number;
  serverTimestamp: number; // Server time when reservation was confirmed
  reservationDurationMs?: number; // Optional: defaults to 5 minutes
}

export interface RemoveFromCartPayload {
  cartItemId: string;
}

export interface UpdateQuantityPayload {
  cartItemId: string;
  quantity: number;
}

export interface SyncTimePayload {
  serverTimestamp: number;
  localTimestamp: number;
}

// Utility type for computing remaining time
export interface ReservationTimeInfo {
  remainingMs: number;
  remainingSeconds: number;
  remainingMinutes: number;
  isExpired: boolean;
  formattedTime: string; // "MM:SS" format
}
