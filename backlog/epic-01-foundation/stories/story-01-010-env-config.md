# Story 01-010: Configure Environment Variables

## Story

**As a** developer
**I want** environment variables properly configured
**So that** the app works in local, preview, and production environments

## Points: 2

## Priority: Critical

## Status: TODO

## Description

Configure environment variables for Supabase, Anthropic API, and GCP Cloud Storage across local development, Netlify preview deploys, and production.

## Acceptance Criteria

- [ ] .env.local template created
- [ ] .env.example with placeholder values
- [ ] Netlify environment variables documented
- [ ] All required variables validated at startup
- [ ] Sensitive keys not exposed to client

## Technical Details

### Environment Variables

```bash
# .env.local (local development)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only, for admin operations

# Anthropic (LLM)
ANTHROPIC_API_KEY=sk-ant-...

# GCP Cloud Storage (for audio files)
NEXT_PUBLIC_GCP_STORAGE_URL=https://storage.googleapis.com/your-bucket

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### .env.example

```bash
# .env.example (committed to repo)

# Supabase - Get from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic - Get from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-key

# GCP Cloud Storage - Your bucket URL
NEXT_PUBLIC_GCP_STORAGE_URL=https://storage.googleapis.com/neuralift-assets

# App URL (set automatically by Netlify in production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Validation

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Public (exposed to browser)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_GCP_STORAGE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Server-only
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_GCP_STORAGE_URL: process.env.NEXT_PUBLIC_GCP_STORAGE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
});

// Type-safe access
export type Env = z.infer<typeof envSchema>;
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

# Environment variables set in Netlify Dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - ANTHROPIC_API_KEY
# - NEXT_PUBLIC_GCP_STORAGE_URL
# - NEXT_PUBLIC_APP_URL (set to production URL)
```

### Netlify Dashboard Setup

1. Go to Site Settings > Environment Variables
2. Add all required variables
3. For preview deploys, variables are inherited from production
4. Use different Supabase project for staging if needed

## Tasks

- [ ] Create .env.example file
- [ ] Create .env.local from template
- [ ] Create src/lib/env.ts with validation
- [ ] Create netlify.toml configuration
- [ ] Add .env.local to .gitignore
- [ ] Document Netlify setup in README
- [ ] Test environment loading

## Dependencies

- Story 01-001 (Initialize Project)
- Story 01-009 (Supabase Setup)

## Notes

- NEXT_PUBLIC_ prefix exposes to browser (be careful!)
- Service role key is admin-level, server-only
- Zod validation catches missing vars at startup
- Netlify sets NEXT_PUBLIC_APP_URL automatically via URL env var
