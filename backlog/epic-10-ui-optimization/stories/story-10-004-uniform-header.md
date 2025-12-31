# Story 10-004: Uniform Header Design

## Story

**As a** user
**I want** a consistent, minimal header across all pages
**So that** I have a predictable navigation experience

## Points: 3

## Priority: High

## Status: TODO

## Description

Implement a uniform header design that is identical across all pages and all screen sizes. The header should contain only the app icon and name on the left side, with no other elements. This creates a clean, consistent experience and maximizes content space.

## Acceptance Criteria

- [ ] Header is identical on all pages
- [ ] Header is identical across mobile, tablet, and desktop
- [ ] Header contains only app icon (N logo) and "Neuralift" text
- [ ] Icon and text are left-aligned
- [ ] No back buttons, menu buttons, or other elements in header
- [ ] Header height is consistent (56px)
- [ ] Header has subtle backdrop blur
- [ ] Clicking header logo/text navigates to home

## Visual Design

### Header Layout
```
┌─────────────────────────────────────────────────────────┐
│  [N] Neuralift                                          │
└─────────────────────────────────────────────────────────┘
     ↑     ↑
     │     └── App name (text-lg, font-semibold)
     └──────── App icon (32x32, cyan background)
```

### Specifications

| Element | Value |
|---------|-------|
| Height | 56px (h-14) |
| Icon Size | 32x32px |
| Icon Background | bg-accent-cyan |
| Icon Text | "N", bold, bg-primary color |
| App Name | "Neuralift", text-lg, font-semibold |
| Gap | 12px between icon and text |
| Padding | 16px horizontal |
| Background | bg-bg-primary/80 backdrop-blur-lg |
| Border | border-b border-border-subtle |

## Technical Details

```typescript
// src/components/navigation/UniformHeader.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UniformHeaderProps {
  className?: string;
}

export function UniformHeader({ className }: UniformHeaderProps) {
  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-14 px-4',
        'flex items-center',
        'bg-bg-primary/80 backdrop-blur-lg',
        'border-b border-border-subtle',
        'pt-[env(safe-area-inset-top)]',
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        aria-label="Neuralift Home"
      >
        {/* App Icon */}
        <div className="w-8 h-8 rounded-lg bg-accent-cyan flex items-center justify-center">
          <span className="text-bg-primary font-bold text-sm">N</span>
        </div>

        {/* App Name */}
        <span className="text-lg font-semibold text-text-primary">
          Neuralift
        </span>
      </Link>
    </motion.header>
  );
}
```

## Pages Affected

All pages will use the same header:
- Home (`/`)
- Level Selection (`/levels`)
- Training Briefing (`/train/[levelId]`)
- Training Session (`/train/[levelId]/session`)
- Results (`/results/[sessionId]`)
- Progress (`/progress`)
- Settings (`/settings`)

## Migration

### Remove from Current Header
- Back button (navigation via bottom nav or browser)
- Page title (handled by page content)
- Menu/settings icons (available in bottom nav)
- Any page-specific actions

### Navigation Changes
- Back navigation: Use bottom nav or browser back
- Page context: Shown in page content, not header

## Tasks

- [ ] Create UniformHeader component
- [ ] Replace MobileHeader with UniformHeader
- [ ] Remove page title logic from header
- [ ] Remove back button logic
- [ ] Update all layout components to use UniformHeader
- [ ] Test header appearance on all pages
- [ ] Test header on all breakpoints
- [ ] Verify home navigation works
- [ ] Update related documentation

## Dependencies

- Story 09-001 (Mobile Header) - replaces this component

## Notes

- This is a simplification of the current header
- Users navigate via bottom nav, not header buttons
- Page context should be clear from page content
- Consider adding subtle page transition animations
- The header logo/text should always link to home
