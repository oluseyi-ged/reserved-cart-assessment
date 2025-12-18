# ShopReserve - Reserved Cart Feature

A React Native application demonstrating a cart reservation system with real-time countdown timers for high-demand limited-stock items.

## Overview

When users add high-demand items to their cart, the system reserves them for a configurable duration (default: 5 minutes). A real-time countdown is visible, and when time expires, items are automatically removed from the cart.

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Native App                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   Screens    │────▶│    Hooks     │────▶│    Redux     │    │
│  │  (Cart, etc) │     │  (Timers)    │     │   (State)    │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                    │                    │             │
│         │                    ▼                    │             │
│         │           ┌──────────────┐              │             │
│         │           │  Time Sync   │              │             │
│         │           │   Service    │              │             │
│         │           └──────────────┘              │             │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Redux Persist                          │   │
│  │              (AsyncStorage Adapter)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Adding to Cart**:
   - User taps "Add to Cart"
   - API call to server (simulated) returns server timestamp
   - Cart slice stores: product, serverReservedAt, localReservedAt, expiresAt
   - Timer hook picks up new item and starts countdown

2. **Timer Management**:
   - Single setInterval (1-second tick) manages ALL cart item timers
   - Each tick recalculates remaining time for all items using `expiresAt - currentServerTime`
   - Expired items trigger Redux action to mark them expired

3. **Persistence & Recovery**:
   - Redux Persist saves cart to AsyncStorage
   - On app restart, cart is restored
   - Expiration is recalculated using stored timestamps and current time

### Time Synchronization Strategy

**The Problem**: Mobile devices can have incorrect system clocks, leading to inaccurate countdowns.

**The Solution**: Server-authoritative time with local offset tracking.

```typescript
// Each cart item stores:
{
  serverReservedAt: number,    // Server timestamp when reserved
  localReservedAt: number,     // Local timestamp when reserved
  expiresAt: number,           // serverReservedAt + duration
}

// Global state tracks:
{
  serverTimeOffset: number,    // serverTime - localTime
}

// Remaining time calculation:
const currentServerTime = Date.now() + serverTimeOffset;
const remainingMs = expiresAt - currentServerTime;
```

**Sync Process**:
1. On app start: fetch server time, calculate offset
2. On network reconnect: re-sync
3. On app foreground: re-sync
4. Periodically: re-sync every 5 minutes

### Handling App Restarts

1. **Cart persisted** to AsyncStorage with timestamps
2. **On restore**:
   - Load persisted cart items
   - Sync time with server
   - Recalculate `isExpired` for each item based on current time
3. **Expired items**: Marked and removed with user notification

### Handling Network Issues

- Timers continue using local time + last known offset
- On reconnect: immediate time re-sync
- Worst case: slight drift (acceptable for 5-minute windows)

## Scalability: 100 Items with 100 Timers

### Current Approach

**Single Timer Pattern**: ONE setInterval manages all countdowns.

```javascript
// ❌ Bad: N timers for N items
items.forEach(item => {
  setInterval(() => updateTimer(item.id), 1000);
});

// ✅ Good: 1 timer for N items
setInterval(() => {
  items.forEach(item => {
    const remaining = calculateRemaining(item);
    // batch update
  });
}, 1000);
```

### Performance Characteristics

| Items | Intervals | Recalculations/sec | Memory |
|-------|-----------|-------------------|--------|
| 1     | 1         | 1                 | O(1)   |
| 10    | 1         | 10                | O(n)   |
| 100   | 1         | 100               | O(n)   |
| 1000  | 1         | 1000              | O(n)   |

### Optimizations for 100+ Items

1. **Memoization**: Only recalculate changed items
2. **Virtualized List**: FlashList renders only visible items
3. **Batch Updates**: React batches state updates automatically
4. **Background Throttling**: Pause updates when app is backgrounded

### Future Scalability Improvements

For 1000+ items:

1. **Priority Queue**: Track only the soonest-expiring items
   ```typescript
   // Instead of checking all 1000 items every second,
   // maintain a min-heap sorted by expiresAt
   const nextExpiring = priorityQueue.peek();
   if (Date.now() >= nextExpiring.expiresAt) {
     // Handle expiration
     priorityQueue.pop();
   }
   ```

2. **Web Workers** (React Native): Offload calculations to separate thread

3. **Server-Side Push**: WebSocket notifications for expiring items

## Project Structure

```
src/
├── components/
│   ├── cart-item/          # Cart item with timer
│   ├── countdown-timer/    # Animated countdown display
│   ├── block/              # Layout component
│   ├── buttons/            # Button components
│   └── text/               # Typography component
├── screens/
│   ├── product-catalog/    # Product listing
│   └── cart/               # Cart with timers
├── slices/
│   └── cart.ts             # Redux slice for cart state
├── hooks/
│   ├── useReservationTimers.ts  # Multi-timer management
│   └── useTimeSync.ts           # Server time synchronization
├── services/
│   └── mockProducts.ts     # Mock product data
├── types/
│   └── cart.ts             # TypeScript interfaces
├── routes/
│   └── index.tsx           # Navigation setup
├── store.ts                # Redux store configuration
└── helpers/
    └── index.ts            # Utility functions
```

## Key Files

- **[src/slices/cart.ts](src/slices/cart.ts)**: Core state management with time calculations
- **[src/hooks/useReservationTimers.ts](src/hooks/useReservationTimers.ts)**: Efficient multi-timer hook
- **[src/hooks/useTimeSync.ts](src/hooks/useTimeSync.ts)**: Server time synchronization
- **[src/components/countdown-timer/index.tsx](src/components/countdown-timer/index.tsx)**: Animated countdown UI

## Running the App

### Prerequisites

- Node.js 18+
- Yarn
- React Native development environment set up

### Installation

```bash
# Install dependencies
yarn install

# iOS only - install CocoaPods
cd ios && pod install && cd ..
```

### Running

```bash
# Start Metro bundler
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Testing the Feature

1. Open the app to see the Product Catalog
2. Tap "Add to Cart" on any limited stock item
3. Navigate to Cart to see the countdown timer
4. Watch the timer count down from 5:00
5. When timer reaches 0, item is marked expired
6. Close and reopen app - timer continues from correct position

## Trade-offs & Decisions

### Why Redux over Context?

- **DevTools**: Redux DevTools for debugging timer state
- **Middleware**: Easy to add logging/analytics
- **Persistence**: Redux Persist integration
- **Performance**: Granular subscriptions with selectors

### Why Single Timer?

- **Efficiency**: O(1) intervals regardless of item count
- **Consistency**: All timers update simultaneously
- **Battery**: Minimal wake-ups

### Why Server Time?

- **Accuracy**: Client clocks can be wrong
- **Consistency**: Same expiration across devices
- **Security**: Harder to manipulate

## Production Considerations

1. **Real API Integration**: Replace mock data with actual endpoints
2. **WebSocket**: Real-time updates from server for cart changes
3. **Error Handling**: Network failures, sync failures
4. **Analytics**: Track reservation utilization rates
5. **A/B Testing**: Optimal reservation duration

## Tech Stack

- React Native 0.79.2
- Redux Toolkit + Redux Persist
- React Navigation 7
- React Native Reanimated 3
- FlashList for performant lists
- TypeScript

---

Built for Technical Assessment: Reserved Cart Feature
