'use client';

/**
 * CoreProvider
 *
 * React context provider that instantiates the core with browser-specific adapters
 * and makes it available to all components via context.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createCoreFactory, type CoreFactory } from '@neuralift/core';

// Infrastructure adapters (stub implementations for now)
import { DexieSessionRepository } from '@/infrastructure/repositories/DexieSessionRepository';
import { DexieProgressRepository } from '@/infrastructure/repositories/DexieProgressRepository';
import { DexieAnalyticsRepository } from '@/infrastructure/repositories/DexieAnalyticsRepository';
import { HowlerAudioPlayer } from '@/infrastructure/audio/HowlerAudioPlayer';
import { AnthropicLLMService } from '@/infrastructure/llm/AnthropicLLMService';
import { BrowserEventBus } from '@/infrastructure/events/BrowserEventBus';

const CoreContext = createContext<CoreFactory | null>(null);

interface CoreProviderProps {
  children: ReactNode;
}

export function CoreProvider({ children }: CoreProviderProps) {
  const core = useMemo(() => {
    return createCoreFactory({
      sessionRepository: new DexieSessionRepository(),
      progressRepository: new DexieProgressRepository(),
      analyticsRepository: new DexieAnalyticsRepository(),
      audioPlayer: new HowlerAudioPlayer(),
      llmService: new AnthropicLLMService(),
      eventBus: new BrowserEventBus(),
    });
  }, []);

  return <CoreContext.Provider value={core}>{children}</CoreContext.Provider>;
}

/**
 * Hook to access the core factory instance
 * Must be used within a CoreProvider
 */
export function useCore(): CoreFactory {
  const context = useContext(CoreContext);
  if (!context) {
    throw new Error('useCore must be used within a CoreProvider');
  }
  return context;
}
