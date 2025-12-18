/**
 * Trip Types for WebSocket Communication
 * Based on SimpliRide WebSocket API Documentation
 * https://realtime.simpliride.com/docs/
 */

// ==================== Trip Status ====================

export type TripStatus =
  | 'IDLE' // No active trip (local state only)
  | 'PENDING' // System searching for drivers
  | 'DRIVER_ASSIGNED' // Driver accepted request
  | 'DRIVER_EN_ROUTE' // Driver navigating to pickup
  | 'DRIVER_ARRIVED' // Driver at pickup location
  | 'TRIP_STARTED' // Passenger onboard, journey started
  | 'COMPLETED' // Trip finished
  | 'CANCELLED'; // Trip cancelled by either party

// ==================== Location Types ====================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationWithDetails extends Coordinates {
  address: string;
  placeId?: string;
}

export interface DriverLocationUpdate {
  latitude: number;
  longitude: number;
  speed?: number; // km/h
  heading?: number; // degrees (0-360)
  accuracy?: number; // meters
  tripId?: string; // Include if in active trip
}

// ==================== Rider Types ====================

export interface Rider {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  profilePictureUrl?: string;
  rating: number;
  totalRides: number;
  phoneNumber?: string;
}

// ==================== Trip Request (from trip:request event) ====================

export interface TripRequest {
  tripId: string;
  rider: Rider;
  pickup: {
    location: LocationWithDetails;
    estimatedTime: number; // minutes
    estimatedDistance: number; // meters
  };
  dropoff: {
    location: LocationWithDetails;
    estimatedTime: number; // minutes
    estimatedDistance: number; // meters
  };
  vehicleType: 'ECONOMY' | 'COMFORT' | 'PREMIUM' | 'XL';
  estimatedFare: {
    amount: number;
    currency: string;
    formatted: string;
  };
  tripDistance: number; // meters
  tripDuration: number; // minutes
  expiresAt: number; // Unix timestamp
  requestedAt: number; // Unix timestamp
  paymentMethod?: 'CASH' | 'CARD' | 'WALLET';
  notes?: string;
}

// ==================== Active Trip (full trip data) ====================

export interface Trip {
  tripId: string;
  status: TripStatus;
  rider: Rider;
  pickup: {
    location: LocationWithDetails;
    arrivedAt?: number; // Unix timestamp when driver arrived
  };
  dropoff: {
    location: LocationWithDetails;
    arrivedAt?: number; // Unix timestamp when completed
  };
  vehicleType: 'ECONOMY' | 'COMFORT' | 'PREMIUM' | 'XL';
  fare: {
    estimatedAmount: number;
    finalAmount?: number;
    currency: string;
    formatted: string;
  };
  distance: {
    estimated: number; // meters
    actual?: number; // meters (after completion)
  };
  duration: {
    estimated: number; // minutes
    actual?: number; // minutes (after completion)
  };
  paymentMethod: 'CASH' | 'CARD' | 'WALLET';
  pin?: string; // 4-digit PIN for trip start verification
  startedAt?: number; // Unix timestamp
  completedAt?: number; // Unix timestamp
  cancelledAt?: number; // Unix timestamp
  cancelledBy?: 'RIDER' | 'DRIVER' | 'SYSTEM';
  cancellationReason?: string;
  notes?: string;
}

// ==================== ETA Updates (from trip:eta event) ====================

export interface TripETA {
  tripId: string;
  minutes: number;
  seconds: number;
  distance: number; // meters
  traffic: 'LIGHT' | 'MODERATE' | 'HEAVY';
  updatedAt: number; // Unix timestamp
}

// ==================== Trip Earnings ====================

export interface TripEarnings {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surge?: number;
  tip?: number;
  tolls?: number;
  fees?: number;
  total: number;
  currency: string;
}

// ==================== Socket Event Payloads ====================

// Connection
export interface SocketConnectedPayload {
  sessionId: string;
  userId: string;
  userType: 'DRIVER';
  timestamp: number;
}

// Error
export interface SocketErrorPayload {
  code:
    | 'RATE_LIMIT'
    | 'FORBIDDEN'
    | 'INVALID_TOKEN'
    | 'VALIDATION_ERROR'
    | 'TRIP_NOT_FOUND'
    | 'TRIP_ALREADY_ACCEPTED'
    | 'INVALID_PIN';
  message: string;
  details?: Record<string, unknown>;
}

// Trip Accept (emit)
export interface TripAcceptPayload {
  tripId: string;
  location?: Coordinates;
}

// Trip Accepted (receive)
export interface TripAcceptedPayload {
  tripId: string;
  trip: Trip;
  message: string;
}

// Trip Reject (emit)
export interface TripRejectPayload {
  tripId: string;
  reason?: string;
}

// Trip Arrived at Pickup (emit)
export interface TripArrivedPickupPayload {
  tripId: string;
  location: Coordinates;
}

// Trip Started (emit)
export interface TripStartedPayload {
  tripId: string;
  pin: string;
  location?: Coordinates;
}

// Trip Started Response (receive)
export interface TripStartedResponsePayload {
  tripId: string;
  valid: boolean;
  message: string;
}

// Trip Completed (emit)
export interface TripCompletedPayload {
  tripId: string;
  finalFare: number;
  location: Coordinates;
}

// Trip Status Update (receive)
export interface TripStatusPayload {
  tripId: string;
  status: TripStatus;
  cancelledBy?: 'RIDER' | 'DRIVER' | 'SYSTEM';
  cancellationReason?: string;
  timestamp: number;
}

// Trip Cancel (emit)
export interface TripCancelPayload {
  tripId: string;
  reason?: string;
}

// Driver Location (receive - for rider tracking)
export interface DriverLocationPayload {
  tripId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  heading: number; // degrees
  timestamp: number;
}

// ==================== Driver Namespace Payloads ====================

// Availability Update (emit)
export interface AvailabilityUpdatePayload {
  isOnline: boolean;
  vehicleType: 'ECONOMY' | 'COMFORT' | 'PREMIUM' | 'XL';
  location: Coordinates;
}

// Vehicle Update (emit)
export interface VehicleUpdatePayload {
  vehicleType: 'ECONOMY' | 'COMFORT' | 'PREMIUM' | 'XL';
}

// ==================== Chat Namespace Payloads ====================

export type MessageStatus = 'sending' | 'sent' | 'read';

export interface ChatMessage {
  messageId: string;
  tripId: string;
  senderId: string;
  senderType: 'RIDER' | 'DRIVER';
  senderName: string;
  content: string;
  type: 'text' | 'location' | 'image';
  timestamp: number;
  status?: MessageStatus; // For driver messages: sending -> sent -> read
}

export interface ChatJoinPayload {
  tripId: string;
}

export interface ChatSendPayload {
  tripId: string;
  content: string;
  type?: 'text' | 'location' | 'image';
}

export interface ChatTypingPayload {
  tripId: string;
  isTyping: boolean;
}

export interface ChatHistoryPayload {
  tripId: string;
  limit?: number;
}

// ==================== Redux State Types ====================

export interface TripState {
  // Connection status
  isConnected: boolean;
  connectionError: string | null;

  // Current trip status
  status: TripStatus;

  // Pending requests (can receive multiple)
  pendingRequests: TripRequest[];

  // Active trip data
  activeTrip: Trip | null;

  // Real-time ETA
  eta: TripETA | null;

  // Wait time countdown (seconds)
  waitTime: number;

  // Trip earnings (after completion)
  earnings: TripEarnings | null;

  // Rider cancelled info
  riderCancelled: {
    cancelled: boolean;
    reason?: string;
  };

  // Loading states
  isAccepting: boolean;
  isRejecting: boolean;
  isStarting: boolean;
  isCompleting: boolean;
  isCancelling: boolean;

  // Error state
  error: string | null;
}

export interface DriverLocationState {
  // Current driver location
  currentLocation: Coordinates | null;

  // Location broadcasting status
  isBroadcasting: boolean;

  // Last broadcast timestamp
  lastBroadcastAt: number | null;

  // Online status
  isOnline: boolean;

  // Current vehicle type
  vehicleType: 'ECONOMY' | 'COMFORT' | 'PREMIUM' | 'XL';
}
