# Phase 2: Design System & Base Components

## Overview

Implement the "Neural Luxe" design system with complete color palette, typography, and reusable UI components. This phase establishes the visual foundation and component library.

---

## Objectives

1. Implement complete CSS variable design system
2. Configure custom typography with variable fonts
3. Create base UI component library
4. Establish animation primitives
5. Build visual effects (glassmorphism, glow, grain)

---

## Design Philosophy: "Neural Luxe"

A fusion of **clinical precision** and **luxury minimalism**—a high-end cognitive lab designed by a Scandinavian design studio. The interface should feel like a premium wellness app meets scientific instrument.

---

## Color System

### Update `src/app/globals.css`

```css
:root {
  /* ========================================
     BACKGROUND COLORS
     ======================================== */
  --bg-primary: #0c0c14;
  --bg-secondary: #12121c;
  --bg-elevated: #1a1a28;
  --bg-glass: rgba(255, 255, 255, 0.03);

  /* ========================================
     SURFACE COLORS
     ======================================== */
  --surface-subtle: rgba(255, 255, 255, 0.04);
  --surface-hover: rgba(255, 255, 255, 0.08);
  --surface-active: rgba(255, 255, 255, 0.12);

  /* ========================================
     NEURAL ACCENT PALETTE
     ======================================== */
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

  /* ========================================
     SEMANTIC COLORS
     ======================================== */
  --success: #22c55e;
  --success-muted: #16a34a;
  --success-subtle: rgba(34, 197, 94, 0.15);

  --error: #ef4444;
  --error-muted: #dc2626;
  --error-subtle: rgba(239, 68, 68, 0.15);

  --warning: #f59e0b;
  --warning-subtle: rgba(245, 158, 11, 0.15);

  /* ========================================
     TEXT HIERARCHY
     ======================================== */
  --text-primary: #f8fafc;
  --text-secondary: rgba(248, 250, 252, 0.7);
  --text-tertiary: rgba(248, 250, 252, 0.4);
  --text-muted: rgba(248, 250, 252, 0.25);

  /* ========================================
     BORDERS & DIVIDERS
     ======================================== */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.15);
  --border-focus: var(--accent-cyan);

  /* ========================================
     SHADOWS
     ======================================== */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
  --shadow-glow-cyan: 0 0 40px -10px var(--accent-cyan-glow-strong);
  --shadow-glow-magenta: 0 0 40px -10px var(--accent-magenta-glow);

  /* ========================================
     SPACING SCALE
     ======================================== */
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

  /* ========================================
     BORDER RADIUS
     ======================================== */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* ========================================
     TRANSITIONS
     ======================================== */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Typography

### Font Configuration

```typescript
// src/app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';
// Or use local variable fonts for Satoshi/Switzer

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-body',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});
```

### Typography CSS Variables

```css
:root {
  /* Font Families */
  --font-display: var(--font-body);  /* For headers - use Satoshi if available */
  --font-body: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'Berkeley Mono', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

---

## Tailwind Configuration

### Update `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          elevated: 'var(--bg-elevated)',
          glass: 'var(--bg-glass)',
        },
        surface: {
          subtle: 'var(--surface-subtle)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        accent: {
          cyan: 'var(--accent-cyan)',
          'cyan-muted': 'var(--accent-cyan-muted)',
          'cyan-glow': 'var(--accent-cyan-glow)',
          magenta: 'var(--accent-magenta)',
          'magenta-glow': 'var(--accent-magenta-glow)',
          gold: 'var(--accent-gold)',
          'gold-glow': 'var(--accent-gold-glow)',
        },
        success: {
          DEFAULT: 'var(--success)',
          muted: 'var(--success-muted)',
          subtle: 'var(--success-subtle)',
        },
        error: {
          DEFAULT: 'var(--error)',
          muted: 'var(--error-muted)',
          subtle: 'var(--error-subtle)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          hover: 'var(--border-hover)',
          focus: 'var(--border-focus)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-magenta': 'var(--shadow-glow-magenta)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Base UI Components

### Button Component

```typescript
// src/components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent-cyan text-bg-primary hover:bg-accent-cyan-muted shadow-glow-cyan',
        secondary: 'bg-surface-subtle border border-border-default text-text-primary hover:bg-surface-hover hover:border-border-hover',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle',
        danger: 'bg-error text-white hover:bg-error-muted',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-11 px-6 text-base rounded-lg',
        lg: 'h-14 px-8 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Card Component

```typescript
// src/components/ui/Card.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-border-subtle p-6 transition-all',
          {
            'bg-bg-secondary': variant === 'default',
            'bg-bg-elevated shadow-lg': variant === 'elevated',
            'bg-bg-glass backdrop-blur-xl': variant === 'glass',
            'shadow-glow-cyan': glow,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
```

### Progress Bar Component

```typescript
// src/components/ui/ProgressBar.tsx
import * as Progress from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  indicatorClassName,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="flex items-center gap-3">
      <Progress.Root
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-surface-subtle',
          className
        )}
        value={value}
        max={max}
      >
        <Progress.Indicator
          className={cn(
            'h-full rounded-full bg-accent-cyan transition-transform duration-500 ease-out',
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </Progress.Root>
      {showLabel && (
        <span className="text-sm text-text-secondary tabular-nums">
          {percentage}%
        </span>
      )}
    </div>
  );
}
```

### Input Component

```typescript
// src/components/ui/Input.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-border-default bg-bg-secondary px-4 py-2 text-base text-text-primary placeholder:text-text-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

---

## Visual Effects

### Glassmorphism Mixin

```css
/* Add to globals.css */
.glass {
  background: linear-gradient(
    135deg,
    rgba(26, 26, 40, 0.95),
    rgba(18, 18, 28, 0.98)
  );
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
}

.glass-light {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
}
```

### Glow Effects

```css
/* Add to globals.css */
.glow-cyan {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 40px -10px var(--accent-cyan-glow-strong);
}

.glow-magenta {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 40px -10px var(--accent-magenta-glow);
}

.text-glow-cyan {
  text-shadow: 0 0 20px var(--accent-cyan-glow-strong);
}
```

### Grain Texture Overlay

```typescript
// src/components/ui/GrainOverlay.tsx
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
```

---

## Utility Functions

### Create `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install dependencies:
```bash
npm install clsx tailwind-merge class-variance-authority
```

---

## Component Index Export

### Create `src/components/ui/index.ts`

```typescript
export { Button, buttonVariants } from './Button';
export { Card } from './Card';
export { ProgressBar } from './ProgressBar';
export { Input } from './Input';
export { GrainOverlay } from './GrainOverlay';
```

---

## Deliverables Checklist

- [ ] Complete CSS variable system implemented
- [ ] Custom fonts configured (or fallbacks set up)
- [ ] Tailwind config extended with design tokens
- [ ] Button component with all variants
- [ ] Card component with variants (default, elevated, glass)
- [ ] ProgressBar component
- [ ] Input component
- [ ] GrainOverlay component
- [ ] Utility functions (cn helper)
- [ ] Visual effect classes (glass, glow)
- [ ] Component index exports
- [ ] All components type-safe

---

## Success Criteria

1. Design tokens accessible via CSS variables and Tailwind classes
2. All components render correctly
3. Hover/focus states work properly
4. Visual effects (glassmorphism, glow) visible
5. Typography hierarchy is clear
6. Color contrast meets accessibility standards (4.5:1 minimum)

---

## Dependencies for Next Phase

Phase 3 (Training Infrastructure) requires:
- Button component for response buttons
- Card component for UI panels
- ProgressBar for session progress
- Design tokens for feedback colors (success/error)

---

## Notes

- Start with system fonts, add custom fonts later if needed
- Test components in isolation before integration
- Ensure dark mode is the default (and only) theme
- Consider creating a Storybook or component playground page for testing
