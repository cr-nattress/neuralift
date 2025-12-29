# Story 06-009: Configure Netlify Deployment

## Story

**As a** developer
**I want** the app deployed to Netlify with proper configuration
**So that** users can access the app with optimal performance and automatic deployments

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Configure Netlify for production deployment with serverless functions for API routes, proper environment variables, preview deploys for PRs, and performance optimizations.

## Acceptance Criteria

- [ ] Netlify site configured and connected to repo
- [ ] Production builds deploy successfully
- [ ] Preview deploys work for pull requests
- [ ] Environment variables configured
- [ ] API routes work as serverless functions
- [ ] Custom domain configured (optional)
- [ ] Performance optimizations enabled

## Technical Details

### netlify.toml Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

# Redirect API routes to serverless functions
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# SPA fallback for client-side routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Cache static assets aggressively
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache audio files
[[headers]]
  for = "*.mp3"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Environment-specific settings
[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"

[context.branch-deploy]
  command = "npm run build"
```

### Next.js Config for Netlify

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Enable static exports where possible
  images: {
    unoptimized: true, // For Netlify deployment
  },

  // Headers (also in netlify.toml but good to have here)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
```

### Netlify Functions for API Routes

```typescript
// netlify/functions/llm-feedback.ts
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userProfile, sessionResult } = JSON.parse(event.body || '{}');

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Generate personalized training feedback for this user:
          Profile: ${JSON.stringify(userProfile)}
          Session: ${JSON.stringify(sessionResult)}

          Provide encouraging, specific feedback in 2-3 sentences.`,
        },
      ],
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback: message.content[0].type === 'text'
          ? message.content[0].text
          : '',
      }),
    };
  } catch (error) {
    console.error('LLM feedback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate feedback' }),
    };
  }
};
```

### Environment Variables Setup

Configure in Netlify Dashboard (Site Settings > Environment Variables):

| Variable | Description | Scope |
|----------|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | All deploys |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | All deploys |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server only) | All deploys |
| `ANTHROPIC_API_KEY` | Claude API key | All deploys |
| `NEXT_PUBLIC_GCP_STORAGE_URL` | GCP bucket URL | All deploys |
| `NEXT_PUBLIC_APP_URL` | App URL (auto-set by Netlify) | Per context |

### Build Plugins

```toml
# netlify.toml (add to existing)

# Cache node_modules between builds
[[plugins]]
  package = "@netlify/plugin-caching"

# Next.js specific optimizations
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "netlify:dev": "netlify dev",
    "netlify:build": "netlify build"
  }
}
```

### Deployment Checklist

```markdown
## Pre-Deployment Checklist

### 1. Netlify Setup
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `.next`

### 2. Environment Variables
- [ ] Add NEXT_PUBLIC_SUPABASE_URL
- [ ] Add NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Add SUPABASE_SERVICE_ROLE_KEY
- [ ] Add ANTHROPIC_API_KEY
- [ ] Add NEXT_PUBLIC_GCP_STORAGE_URL

### 3. Build Configuration
- [ ] Verify netlify.toml is committed
- [ ] Install @netlify/plugin-nextjs
- [ ] Test local build: `npm run build`

### 4. Domain Setup (Optional)
- [ ] Add custom domain in Netlify
- [ ] Configure DNS records
- [ ] Enable HTTPS (automatic)

### 5. Post-Deployment
- [ ] Verify production build
- [ ] Test all API routes
- [ ] Check Supabase connection
- [ ] Test audio playback from GCP
- [ ] Verify environment variables work
```

### Preview Deploy Configuration

```toml
# Branch deploy settings (netlify.toml)
[context.deploy-preview.environment]
  NEXT_PUBLIC_APP_URL = ""  # Netlify sets this automatically

# Optionally use staging Supabase for previews
# [context.deploy-preview.environment]
#   NEXT_PUBLIC_SUPABASE_URL = "https://staging-project.supabase.co"
```

## Tasks

- [ ] Create netlify.toml configuration file
- [ ] Update next.config.js for Netlify
- [ ] Create netlify/functions directory structure
- [ ] Move LLM API route to Netlify function
- [ ] Set up Netlify site and connect repo
- [ ] Configure all environment variables
- [ ] Install Netlify CLI for local testing
- [ ] Test preview deploy functionality
- [ ] Configure custom domain (if available)
- [ ] Document deployment process in README

## Dependencies

- Story 01-010 (Environment Variables)
- Story 03-011 (LLM Service - for API route)
- All other stories should be complete before production deploy

## Notes

- Netlify Functions have 10s timeout on free tier, 26s on Pro
- Use @netlify/plugin-nextjs for optimal Next.js support
- Preview deploys automatically get unique URLs
- Consider branch deploys for staging environment
- Monitor build minutes on free tier (300/month)
