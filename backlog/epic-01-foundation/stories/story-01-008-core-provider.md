# Story 01-008: Setup React Core Provider

## Story

**As a** developer
**I want** a React context provider for the core instance
**So that** React components can access core functionality

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Create the CoreProvider React component that instantiates the core with browser-specific adapters and makes it available to all components via context.

## Acceptance Criteria

- [ ] CoreProvider component created
- [ ] useCore() hook for accessing core instance
- [ ] Core instantiated with browser adapters
- [ ] Provider added to root layout
- [ ] Error thrown if useCore used outside provider

## Technical Details

### CoreProvider Implementation

```typescript
// src/application/providers/CoreProvider.tsx
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createCore, type CoreInstance } from '@neuralift/core';

// Infrastructure adapters (to be implemented in Epic 03)
import { DexieSessionRepository } from '@/infrastructure/repositories/DexieSessionRepository';
import { DexieProgressRepository } from '@/infrastructure/repositories/DexieProgressRepository';
import { DexieAnalyticsRepository } from '@/infrastructure/repositories/DexieAnalyticsRepository';
import { HowlerAudioPlayer } from '@/infrastructure/audio/HowlerAudioPlayer';
import { AnthropicLLMService } from '@/infrastructure/llm/AnthropicLLMService';
import { BrowserEventBus } from '@/infrastructure/analytics/BrowserEventBus';

const CoreContext = createContext<CoreInstance | null>(null);

interface CoreProviderProps {
  children: ReactNode;
}

export function CoreProvider({ children }: CoreProviderProps) {
  const core = useMemo(() => {
    return createCore({
      sessionRepository: new DexieSessionRepository(),
      progressRepository: new DexieProgressRepository(),
      analyticsRepository: new DexieAnalyticsRepository(),
      audioPlayer: new HowlerAudioPlayer(),
      llmService: new AnthropicLLMService(),
      eventBus: new BrowserEventBus(),
    });
  }, []);

  return (
    <CoreContext.Provider value={core}>
      {children}
    </CoreContext.Provider>
  );
}

export function useCore(): CoreInstance {
  const context = useContext(CoreContext);
  if (!context) {
    throw new Error('useCore must be used within a CoreProvider');
  }
  return context;
}
```

### Root Layout Integration

```typescript
// src/app/layout.tsx
import { CoreProvider } from '@/application/providers/CoreProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CoreProvider>
          {children}
        </CoreProvider>
      </body>
    </html>
  );
}
```

### Stub Adapters (for now)

Until Epic 03 implements real adapters, create stub implementations:

```typescript
// src/infrastructure/repositories/DexieSessionRepository.ts
import type { ISessionRepository, SessionResult } from '@neuralift/core';

export class DexieSessionRepository implements ISessionRepository {
  async save(session: SessionResult): Promise<void> {
    console.log('TODO: Implement save', session.sessionId);
  }
  async findById(sessionId: string): Promise<SessionResult | null> {
    return null;
  }
  async findByLevel(levelId: string): Promise<SessionResult[]> {
    return [];
  }
  async findRecent(limit: number): Promise<SessionResult[]> {
    return [];
  }
  async findByDateRange(start: Date, end: Date): Promise<SessionResult[]> {
    return [];
  }
  async count(): Promise<number> {
    return 0;
  }
  async clear(): Promise<void> {}
}
```

## Tasks

- [ ] Create src/application/providers/ directory
- [ ] Create CoreProvider.tsx
- [ ] Create useCore hook
- [ ] Create stub adapter files in infrastructure/
- [ ] Update root layout.tsx to use CoreProvider
- [ ] Verify app compiles and runs
- [ ] Test that useCore works in a page component

## Dependencies

- Story 01-007 (Core Factory)

## Notes

- This completes the Epic 01 foundation
- Stub adapters will be replaced in Epic 03
- useMemo ensures core is only created once
