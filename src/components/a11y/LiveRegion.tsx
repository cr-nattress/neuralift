'use client';

/**
 * LiveRegion Component
 *
 * Provides a way to announce dynamic content changes to screen readers.
 * Uses aria-live regions to communicate updates without visual changes.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Politeness = 'polite' | 'assertive';

interface LiveRegionContextValue {
  announce: (message: string, politeness?: Politeness) => void;
}

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null);

/**
 * Hook to access the live region announcer
 */
export function useLiveRegion() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    throw new Error('useLiveRegion must be used within a LiveRegionProvider');
  }
  return context;
}

interface LiveRegionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages screen reader announcements
 */
export function LiveRegionProvider({ children }: LiveRegionProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, politeness: Politeness = 'polite') => {
    // Clear first to ensure the same message can be announced again
    if (politeness === 'assertive') {
      setAssertiveMessage('');
      // Use requestAnimationFrame to ensure the clear happens first
      requestAnimationFrame(() => {
        setAssertiveMessage(message);
      });
    } else {
      setPoliteMessage('');
      requestAnimationFrame(() => {
        setPoliteMessage(message);
      });
    }

    // Clear after a delay
    setTimeout(() => {
      if (politeness === 'assertive') {
        setAssertiveMessage('');
      } else {
        setPoliteMessage('');
      }
    }, 1000);
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}

      {/* Polite announcements - for non-urgent updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>

      {/* Assertive announcements - for urgent updates */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveRegionContext.Provider>
  );
}
