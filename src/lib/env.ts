import { z } from 'zod';

/**
 * Environment variable validation schema
 *
 * Uses Zod to validate and type environment variables at runtime.
 * Public variables (NEXT_PUBLIC_*) are exposed to the browser.
 * Server-only variables are only available in API routes and server components.
 */

// Schema for public (client-side) environment variables
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_AUDIO_BUCKET_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  NEXT_PUBLIC_DEBUG: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
});

// Schema for server-only environment variables
const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
});

// Combined schema for all environment variables
const envSchema = publicEnvSchema.merge(serverEnvSchema);

// Type definitions
export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type Env = z.infer<typeof envSchema>;

/**
 * Validates and returns public environment variables
 * Safe to use in client components
 */
export function getPublicEnv(): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_AUDIO_BUCKET_URL: process.env.NEXT_PUBLIC_AUDIO_BUCKET_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
  });

  if (!result.success) {
    console.error('Invalid public environment variables:', result.error.format());
    throw new Error('Invalid public environment configuration');
  }

  return result.data;
}

/**
 * Validates and returns all environment variables (including server-only)
 * Only use in server components, API routes, or server actions
 */
export function getServerEnv(): Env {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv cannot be called on the client');
  }

  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_AUDIO_BUCKET_URL: process.env.NEXT_PUBLIC_AUDIO_BUCKET_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  });

  if (!result.success) {
    console.error('Invalid server environment variables:', result.error.format());
    throw new Error('Invalid server environment configuration');
  }

  return result.data;
}

/**
 * Helper to check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NEXT_PUBLIC_APP_ENV === 'development';
}

/**
 * Helper to check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG === 'true';
}
