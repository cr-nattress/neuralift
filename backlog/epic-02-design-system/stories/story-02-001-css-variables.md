# Story 02-001: Implement CSS Variables

## Story

**As a** developer
**I want** a complete CSS variable design system
**So that** colors, spacing, and effects are consistent throughout the app

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Implement the complete CSS variable system in globals.css covering backgrounds, surfaces, accents, semantic colors, text, borders, shadows, spacing, and transitions.

## Acceptance Criteria

- [ ] All color variables defined
- [ ] Spacing scale defined
- [ ] Border radius tokens defined
- [ ] Shadow tokens including glow effects
- [ ] Transition timing tokens defined
- [ ] Variables work in Tailwind config

## Technical Details

### globals.css

```css
:root {
  /* BACKGROUND COLORS */
  --bg-primary: #0c0c14;
  --bg-secondary: #12121c;
  --bg-elevated: #1a1a28;
  --bg-glass: rgba(255, 255, 255, 0.03);

  /* SURFACE COLORS */
  --surface-subtle: rgba(255, 255, 255, 0.04);
  --surface-hover: rgba(255, 255, 255, 0.08);
  --surface-active: rgba(255, 255, 255, 0.12);

  /* NEURAL ACCENT PALETTE */
  --accent-cyan: #00e5cc;
  --accent-cyan-muted: #00b8a3;
  --accent-cyan-glow: rgba(0, 229, 204, 0.15);
  --accent-cyan-glow-strong: rgba(0, 229, 204, 0.3);

  --accent-magenta: #e930ff;
  --accent-magenta-muted: #c020d9;
  --accent-magenta-glow: rgba(233, 48, 255, 0.15);

  --accent-gold: #ffd93d;
  --accent-gold-muted: #e5c235;
  --accent-gold-glow: rgba(255, 217, 61, 0.15);

  /* SEMANTIC COLORS */
  --success: #22c55e;
  --success-muted: #16a34a;
  --success-subtle: rgba(34, 197, 94, 0.15);

  --error: #ef4444;
  --error-muted: #dc2626;
  --error-subtle: rgba(239, 68, 68, 0.15);

  --warning: #f59e0b;
  --warning-subtle: rgba(245, 158, 11, 0.15);

  /* TEXT HIERARCHY */
  --text-primary: #f8fafc;
  --text-secondary: rgba(248, 250, 252, 0.7);
  --text-tertiary: rgba(248, 250, 252, 0.4);
  --text-muted: rgba(248, 250, 252, 0.25);

  /* BORDERS & DIVIDERS */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.15);
  --border-focus: var(--accent-cyan);

  /* SHADOWS */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
  --shadow-glow-cyan: 0 0 40px -10px var(--accent-cyan-glow-strong);
  --shadow-glow-magenta: 0 0 40px -10px var(--accent-magenta-glow);

  /* SPACING SCALE */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* BORDER RADIUS */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* TRANSITIONS */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Base styles */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

## Tasks

- [ ] Update src/app/globals.css with all variables
- [ ] Set body background and text color
- [ ] Verify variables load correctly
- [ ] Check dark background renders

## Dependencies

- Story 01-001 (Initialize Next.js Project)

## Notes

- Dark mode is the only mode - no light mode toggle needed
- Glow shadows are key to the "Neural Luxe" aesthetic
