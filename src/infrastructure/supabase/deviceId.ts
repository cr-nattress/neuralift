'use client';

/**
 * Device ID Management
 *
 * Generates and persists a unique device ID for anonymous user identification.
 * This allows data sync across browser sessions without requiring authentication.
 */

import { nanoid } from 'nanoid';

const DEVICE_ID_KEY = 'neuralift_device_id';

/**
 * Get or create a unique device ID
 * Persists to localStorage for consistency across sessions
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    // Server-side - return a temporary ID
    return `server-${nanoid()}`;
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = `device-${nanoid()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Check if a device ID exists
 */
export function hasDeviceId(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem(DEVICE_ID_KEY);
}

/**
 * Clear the device ID (useful for testing or reset)
 */
export function clearDeviceId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEVICE_ID_KEY);
  }
}
