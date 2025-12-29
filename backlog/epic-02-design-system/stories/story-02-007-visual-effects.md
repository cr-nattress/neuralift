# Story 02-007: Create Visual Effects

## Story

**As a** designer
**I want** visual effect components and styles
**So that** the app has the premium "Neural Luxe" aesthetic

## Points: 3

## Priority: High

## Status: TODO

## Description

Create the visual effects that define the "Neural Luxe" aesthetic: glassmorphism, glow effects, film grain overlay, and animated background orbs.

## Acceptance Criteria

- [ ] GlassPanel wrapper component
- [ ] GlowBorder component for accent borders
- [ ] GrainOverlay component for texture
- [ ] Background gradient styles
- [ ] All effects respect reduced motion preference

## Technical Details

### GlassPanel Component

```typescript
// src/components/ui/GlassPanel.tsx
'use client';

import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg';
  opacity?: 'low' | 'medium' | 'high';
}

export function GlassPanel({
  className,
  blur = 'md',
  opacity = 'medium',
  children,
  ...props
}: GlassPanelProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const opacityClasses = {
    low: 'bg-white/[0.02]',
    medium: 'bg-white/[0.04]',
    high: 'bg-white/[0.08]',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.06]',
        blurClasses[blur],
        opacityClasses[opacity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### GlowBorder Component

```typescript
// src/components/ui/GlowBorder.tsx
'use client';

import { cn } from '@/lib/utils';

interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'cyan' | 'magenta' | 'gold';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

export function GlowBorder({
  className,
  color = 'cyan',
  intensity = 'medium',
  animated = false,
  children,
  ...props
}: GlowBorderProps) {
  const colorClasses = {
    cyan: 'border-accent-cyan shadow-glow-cyan',
    magenta: 'border-accent-magenta shadow-glow-magenta',
    gold: 'border-accent-gold',
  };

  const intensityClasses = {
    low: 'border opacity-50',
    medium: 'border-2',
    high: 'border-2 shadow-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl',
        colorClasses[color],
        intensityClasses[intensity],
        animated && 'animate-pulse-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### GrainOverlay Component

```typescript
// src/components/ui/GrainOverlay.tsx
'use client';

export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  );
}
```

### Global Background Styles (globals.css addition)

```css
/* Background gradient */
.bg-gradient-neural {
  background:
    radial-gradient(ellipse at 20% 0%, var(--accent-cyan-glow) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, var(--accent-magenta-glow) 0%, transparent 50%),
    var(--bg-primary);
}

/* Animated gradient orbs */
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: float 20s ease-in-out infinite;
}

.orb-cyan {
  background: var(--accent-cyan-glow);
  width: 600px;
  height: 600px;
  opacity: 0.2;
}

.orb-magenta {
  background: var(--accent-magenta-glow);
  width: 500px;
  height: 500px;
  opacity: 0.15;
  animation-delay: -10s;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .orb,
  .animate-pulse-glow {
    animation: none;
  }
}
```

### BackgroundOrbs Component

```typescript
// src/components/ui/BackgroundOrbs.tsx
'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

export function BackgroundOrbs() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="orb orb-cyan absolute -top-[200px] -right-[200px]" />
      <div className="orb orb-magenta absolute -bottom-[200px] -left-[200px]" />
    </div>
  );
}
```

## Tasks

- [ ] Create src/components/ui/GlassPanel.tsx
- [ ] Create src/components/ui/GlowBorder.tsx
- [ ] Create src/components/ui/GrainOverlay.tsx
- [ ] Create src/components/ui/BackgroundOrbs.tsx
- [ ] Add CSS for gradients and orbs to globals.css
- [ ] Add keyframes and @media query
- [ ] Create useReducedMotion hook
- [ ] Add components to root layout
- [ ] Test visual effects render correctly

## Dependencies

- Story 02-001 (CSS Variables)
- Story 02-003 (Tailwind Config)

## Notes

- Grain overlay adds subtle texture like film
- Background orbs create depth and movement
- All animations respect prefers-reduced-motion
