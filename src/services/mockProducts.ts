/**
 * Mock Product Data
 *
 * In production, this would come from an API.
 * Products are marked as limited stock to demonstrate the reservation feature.
 */

import {Product} from '@types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199.00,
    isLimitedStock: true,
    stockCount: 3,
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    price: 1999.00,
    isLimitedStock: true,
    stockCount: 2,
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    price: 249.00,
    isLimitedStock: true,
    stockCount: 5,
  },
  {
    id: '4',
    name: 'Apple Watch Ultra 2',
    price: 799.00,
    isLimitedStock: true,
    stockCount: 4,
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    price: 1099.00,
    isLimitedStock: true,
    stockCount: 3,
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    price: 349.00,
    isLimitedStock: true,
    stockCount: 6,
  },
  {
    id: '7',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299.00,
    isLimitedStock: true,
    stockCount: 4,
  },
  {
    id: '8',
    name: 'Nintendo Switch OLED',
    price: 349.00,
    isLimitedStock: true,
    stockCount: 8,
  },
  {
    id: '9',
    name: 'PS5 Digital Edition',
    price: 449.00,
    isLimitedStock: true,
    stockCount: 2,
  },
  {
    id: '10',
    name: 'Xbox Series X',
    price: 499.00,
    isLimitedStock: true,
    stockCount: 3,
  },
];

/**
 * Simulates fetching server time with the add-to-cart response
 * In production, this would be part of the API response
 */
export const simulateAddToCart = async (
  productId: string,
): Promise<{serverTimestamp: number; reservationDurationMs: number}> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  // Return server timestamp and reservation duration
  return {
    serverTimestamp: Date.now(),
    reservationDurationMs: 5 * 60 * 1000, // 5 minutes
  };
};
