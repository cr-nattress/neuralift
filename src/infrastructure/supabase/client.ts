'use client';

/**
 * Supabase Browser Client
 *
 * Creates a Supabase client for use in browser/client components.
 * This client uses the anonymous key and is safe for client-side use.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export type SupabaseBrowserClient = SupabaseClient<Database>;

let supabaseClient: SupabaseBrowserClient | null = null;

/**
 * Get or create the Supabase browser client
 * Uses singleton pattern to reuse the same client instance
 */
export function getSupabaseBrowserClient(): SupabaseBrowserClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing environment variables, cloud sync disabled');
    return null;
  }

  supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

  return supabaseClient;
}

/**
 * Check if Supabase is configured and available
 */
export function isSupabaseAvailable(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
