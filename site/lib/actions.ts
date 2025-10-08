/**
 * Actions for React 19
 * Server-like actions pattern with automatic error/pending handling
 *
 * React 19 Actions Benefits:
 * - Automatic pending states
 * - Built-in error handling
 * - Optimistic updates support
 * - Works with useTransition
 */

import { addViewerPin, fetchViewerPins } from './firebaseClient';

import type { ActionResponse, Pin } from '../types';

/**
 * Add Pin Action
 * React 19 action for adding viewer pin with automatic error handling
 *
 * @param formData - Form data containing lat/lng
 * @returns Promise with success status and updated pins
 */
export async function addPinAction(formData: FormData): Promise<ActionResponse<Pin[]>> {
  try {
    const lat = parseFloat(formData.get('lat') as string);
    const lng = parseFloat(formData.get('lng') as string);
    const message = (formData.get('message') as string) || null;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return { success: false, error: 'Invalid coordinates' };
    }

    // Add pin to Firestore
    const result = await addViewerPin({ lat, lng, message });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Fetch updated pins
    const pins = (await fetchViewerPins()) as Pin[];

    return { success: true, data: pins };
  } catch (error) {
    console.error('Add pin action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add pin';
    return { success: false, error: errorMessage };
  }
}

/**
 * Fetch Pins Action
 * React 19 action for fetching all viewer pins
 *
 * @returns Promise with success status and pins array
 */
export async function fetchPinsAction(): Promise<ActionResponse<Pin[]>> {
  try {
    const pins = (await fetchViewerPins()) as Pin[];
    return { success: true, data: pins };
  } catch (error) {
    console.error('Fetch pins action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pins';
    return { success: false, error: errorMessage, data: [] };
  }
}
