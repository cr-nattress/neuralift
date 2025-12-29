# Phase 6: Polish, Animations & Accessibility

## Overview

Finalize the application with refined animations, responsive design optimization, accessibility compliance, performance tuning, and comprehensive testing.

---

## Objectives

1. Implement all signature animations
2. Optimize responsive design for all breakpoints
3. Achieve WCAG 2.1 AA accessibility compliance
4. Performance optimization
5. Cross-browser and device testing
6. Final polish and bug fixes

---

## Animation System

### Animation Configuration

```typescript
// src/lib/animations.ts
export const animations = {
  // ==========================================
  // POPOVER ANIMATIONS
  // ==========================================
  popoverIn: {
    initial: { opacity: 0, scale: 0.95, y: -8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -8 },
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },

  // ==========================================
  // GRID CELL ANIMATIONS
  // ==========================================
  cellActivate: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(0, 229, 204, 0)',
        '0 0 30px 10px rgba(0, 229, 204, 0.3)',
        '0 0 0 0 rgba(0, 229, 204, 0)',
      ],
    },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  cellPulse: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(0, 229, 204, 0.4)',
        '0 0 0 15px rgba(0, 229, 204, 0)',
      ],
    },
    transition: { duration: 1, repeat: Infinity },
  },

  // ==========================================
  // FEEDBACK ANIMATIONS
  // ==========================================
  correctFlash: {
    animate: {
      backgroundColor: [
        'rgba(34, 197, 94, 0.3)',
        'rgba(34, 197, 94, 0)',
      ],
      scale: [1, 1.05, 1],
    },
    transition: { duration: 0.4, ease: 'easeOut' },
  },

  incorrectShake: {
    animate: {
      x: [0, -8, 8, -8, 8, 0],
      backgroundColor: [
        'rgba(239, 68, 68, 0.3)',
        'rgba(239, 68, 68, 0)',
      ],
    },
    transition: { duration: 0.4 },
  },

  // ==========================================
  // BUTTON ANIMATIONS
  // ==========================================
  buttonTap: {
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },

  buttonHover: {
    whileHover: { scale: 1.02 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },

  // ==========================================
  // PAGE TRANSITIONS
  // ==========================================
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  staggerChildren: {
    animate: { transition: { staggerChildren: 0.1 } },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },

  // ==========================================
  // PROGRESS ANIMATIONS
  // ==========================================
  progressFill: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  scoreReveal: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },

  // ==========================================
  // COUNTDOWN ANIMATIONS
  // ==========================================
  countdownNumber: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.5, opacity: 0 },
    transition: { duration: 0.5 },
  },
};
```

### Reduced Motion Support

```typescript
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Usage in components
const reducedMotion = useReducedMotion();

<motion.div
  animate={reducedMotion ? {} : animations.cellActivate.animate}
  transition={reducedMotion ? { duration: 0 } : animations.cellActivate.transition}
/>
```

---

## Background Visual Effects

### Animated Gradient Orbs

```typescript
// src/components/ui/BackgroundOrbs.tsx
'use client';

import { motion } from 'framer-motion';

export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Cyan orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--accent-cyan-glow) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: ['-20%', '10%', '-20%'],
          y: ['-10%', '20%', '-10%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '10%', left: '60%' }}
      />

      {/* Magenta orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, var(--accent-magenta-glow) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: ['10%', '-15%', '10%'],
          y: ['15%', '-10%', '15%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ bottom: '20%', left: '10%' }}
      />
    </div>
  );
}
```

---

## Responsive Design

### Breakpoints

```css
/* Tailwind defaults extended */
screens: {
  'xs': '475px',    /* Small phones */
  'sm': '640px',    /* Large phones */
  'md': '768px',    /* Tablets */
  'lg': '1024px',   /* Laptops */
  'xl': '1280px',   /* Desktops */
  '2xl': '1536px',  /* Large desktops */
}
```

### Mobile-First Component Examples

```typescript
// Grid responsive sizing
<div className="grid grid-cols-3 gap-2 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">

// Response buttons
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <ResponseButton className="w-full sm:w-40" />
  <ResponseButton className="w-full sm:w-40" />
</div>

// Popover as bottom sheet on mobile
<PopoverContent className="fixed bottom-0 left-0 right-0 rounded-b-none sm:relative sm:rounded-2xl sm:max-w-[360px]">
```

### Touch Optimization

```css
/* Minimum touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Larger tap areas on mobile */
@media (pointer: coarse) {
  .button {
    padding: 16px 24px;
  }
}
```

---

## Accessibility Checklist

### Keyboard Navigation

```typescript
// Focus trap for modals
import { FocusTrap } from '@radix-ui/react-focus-trap';

<FocusTrap>
  <Modal>...</Modal>
</FocusTrap>

// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-bg-primary focus:rounded-lg">
  Skip to main content
</a>

// Keyboard shortcut hints
<span className="hidden sm:inline text-text-muted">[ A ]</span>
```

### ARIA Labels and Roles

```typescript
// Grid cells
<div
  role="grid"
  aria-label="N-back memory grid"
>
  {cells.map((cell, i) => (
    <div
      key={i}
      role="gridcell"
      aria-label={`Position ${getPositionName(i)}`}
      aria-selected={activePosition === i}
    />
  ))}
</div>

// Response buttons
<button
  aria-label="Position match - press when current position matches position from N steps ago"
  aria-pressed={hasResponded}
>
  Position Match
</button>

// Progress
<div
  role="progressbar"
  aria-valuenow={currentTrial}
  aria-valuemin={0}
  aria-valuemax={totalTrials}
  aria-label={`Trial ${currentTrial} of ${totalTrials}`}
>
```

### Screen Reader Announcements

```typescript
// src/components/ui/LiveRegion.tsx
'use client';

import { useState, useEffect } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      // Clear after announcement
      const timeout = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

// Usage
<LiveRegion message={`Trial ${trial}: Position ${positionName}, Letter ${letter}`} />
<LiveRegion message="Correct!" politeness="assertive" />
```

### Color Contrast

```css
/* All text combinations must meet 4.5:1 contrast ratio */
/* Primary text on dark background: #f8fafc on #0c0c14 = 17.5:1 ✓ */
/* Secondary text: rgba(248,250,252,0.7) on #0c0c14 = 10.8:1 ✓ */
/* Accent cyan on dark: #00e5cc on #0c0c14 = 11.2:1 ✓ */

/* Ensure interactive elements have visible focus states */
:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
}
```

### Complete Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus visible on all focusable elements
- [ ] Focus trap in modals and popovers
- [ ] Skip link to main content
- [ ] ARIA labels on all non-text elements
- [ ] Screen reader announcements for game events
- [ ] Color contrast minimum 4.5:1
- [ ] Touch targets minimum 44×44px
- [ ] Reduced motion media query support
- [ ] Audio content has text alternative
- [ ] Error messages are announced
- [ ] Form inputs have labels
- [ ] Semantic HTML structure

---

## Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
const ResultsChart = dynamic(() => import('@/components/results/ResultsChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const LearnMoreModal = dynamic(() => import('@/components/help/LearnMoreModal'));
```

### Image Optimization

```typescript
// Use next/image for all images
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Neuralift Logo"
  width={200}
  height={60}
  priority // For above-fold images
/>
```

### Audio Preloading

```typescript
// Preload audio on app mount, not on component mount
useEffect(() => {
  // Preload after initial render
  const timeout = setTimeout(() => {
    audioManager.initialize();
  }, 1000);

  return () => clearTimeout(timeout);
}, []);
```

### Animation Performance

```css
/* Use transform and opacity for animations (GPU accelerated) */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

/* Avoid animating expensive properties */
/* Bad: width, height, top, left, margin, padding */
/* Good: transform, opacity */
```

### Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true next build"

# Install bundle analyzer
npm install @next/bundle-analyzer
```

---

## Testing Strategy

### Unit Tests

```typescript
// src/lib/game/__tests__/scorer.test.ts
import { calculateStats, calculateDPrime } from '../scorer';

describe('calculateStats', () => {
  it('calculates perfect accuracy correctly', () => {
    const trials = [
      { isPositionMatch: true, userPositionResponse: true },
      { isPositionMatch: false, userPositionResponse: false },
      // ...
    ];
    const stats = calculateStats(trials, 'position');
    expect(stats.accuracy).toBe(1);
  });

  it('handles no matches correctly', () => {
    // ...
  });
});

describe('calculateDPrime', () => {
  it('returns higher d-prime for better discrimination', () => {
    const goodDPrime = calculateDPrime(0.9, 0.1);
    const poorDPrime = calculateDPrime(0.6, 0.4);
    expect(goodDPrime).toBeGreaterThan(poorDPrime);
  });
});
```

### Component Tests

```typescript
// src/components/training/__tests__/Grid.test.tsx
import { render, screen } from '@testing-library/react';
import { Grid } from '../Grid';

describe('Grid', () => {
  it('renders 9 cells', () => {
    render(<Grid activePosition={null} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(9);
  });

  it('highlights active cell', () => {
    render(<Grid activePosition={4} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells[4]).toHaveAttribute('aria-selected', 'true');
  });
});
```

### E2E Tests

```typescript
// e2e/training-session.spec.ts
import { test, expect } from '@playwright/test';

test('completes a training session', async ({ page }) => {
  await page.goto('/train/position-1back');

  // Start session
  await page.click('text=BEGIN SESSION');

  // Wait for countdown
  await page.waitForTimeout(3000);

  // Complete trials (simulate)
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(3000);
    // Randomly press match buttons
    if (Math.random() > 0.7) {
      await page.press('body', 'a');
    }
  }

  // Verify results page
  await expect(page.locator('text=SESSION COMPLETE')).toBeVisible();
});

test('keyboard shortcuts work', async ({ page }) => {
  await page.goto('/train/dual-1back/session');
  await page.waitForSelector('[data-tour="grid"]');

  await page.press('body', 'a');
  // Verify position response registered

  await page.press('body', 'l');
  // Verify audio response registered

  await page.press('body', 'Escape');
  // Verify pause modal appears
});
```

### Accessibility Tests

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('training page has no accessibility violations', async ({ page }) => {
  await page.goto('/train/position-1back/session');
  const results = await new AxeBuilder({ page })
    .exclude('[data-testid="animated-element"]') // Exclude animated elements
    .analyze();
  expect(results.violations).toEqual([]);
});
```

---

## Final Polish Items

### Loading States

```typescript
// src/components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-surface-subtle',
        className
      )}
    />
  );
}

// Usage
<Skeleton className="w-32 h-8" /> // For text
<Skeleton className="w-full h-64 rounded-2xl" /> // For cards
```

### Error Boundaries

```typescript
// src/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Something went wrong
          </h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-accent-cyan hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Empty States

```typescript
// src/components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
```

---

## Deliverables Checklist

### Animations
- [ ] Cell activation glow animation
- [ ] Correct/incorrect feedback animations
- [ ] Button press animations
- [ ] Page transitions
- [ ] Countdown animation
- [ ] Score reveal animation
- [ ] Background orb animations
- [ ] Reduced motion support

### Responsive Design
- [ ] Mobile layout (< 640px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Touch-optimized controls
- [ ] Bottom sheet popovers on mobile

### Accessibility
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Focus states visible
- [ ] ARIA labels complete
- [ ] Skip link implemented
- [ ] Live region announcements

### Performance
- [ ] Lighthouse score > 90
- [ ] First contentful paint < 1.5s
- [ ] Time to interactive < 3s
- [ ] No layout shifts
- [ ] Audio preloaded efficiently

### Testing
- [ ] Unit tests for game logic
- [ ] Component tests for UI
- [ ] E2E tests for critical flows
- [ ] Accessibility audit passing
- [ ] Cross-browser testing complete

### Polish
- [ ] Loading states for async operations
- [ ] Error boundaries in place
- [ ] Empty states designed
- [ ] 404 page styled
- [ ] Favicon and meta tags

---

## Success Criteria

1. Application works on Chrome, Firefox, Safari, Edge
2. Mobile experience is fully functional
3. All accessibility audits pass
4. Performance scores meet targets
5. No console errors in production
6. All critical user flows tested
7. Animations feel smooth and premium

---

## Launch Readiness Checklist

- [ ] All features implemented and tested
- [ ] Performance optimized
- [ ] Accessibility compliant
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Analytics integrated (if desired)
- [ ] SEO meta tags complete
- [ ] Open Graph images created
- [ ] Documentation updated
- [ ] Deployment pipeline tested

---

## Notes

- Test on real devices, not just emulators
- Get user feedback on animation timing
- Monitor performance in production
- Plan for future enhancements post-launch
- Consider progressive web app (PWA) features
