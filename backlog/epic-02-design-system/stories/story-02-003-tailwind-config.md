# Story 02-003: Setup Tailwind Config

## Story

**As a** developer
**I want** Tailwind configured with our design tokens
**So that** I can use utility classes that match the design system

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Configure Tailwind CSS to use our CSS variables and extend the default theme with custom values for colors, spacing, shadows, and animations.

## Acceptance Criteria

- [ ] All colors mapped to CSS variables
- [ ] Custom shadows including glow effects
- [ ] Custom border radius values
- [ ] Animation timing functions defined
- [ ] Keyframes for custom animations
- [ ] Dark mode forced (no light mode)

## Technical Details

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
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
          'magenta-muted': 'var(--accent-magenta-muted)',
          'magenta-glow': 'var(--accent-magenta-glow)',
          gold: 'var(--accent-gold)',
          'gold-muted': 'var(--accent-gold-muted)',
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
        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
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
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-magenta': 'var(--shadow-glow-magenta)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'shake': 'shake 0.3s ease-in-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
```

## Tasks

- [ ] Update tailwind.config.ts with full config
- [ ] Verify all custom classes work
- [ ] Test glow shadows render correctly
- [ ] Test animations work
- [ ] Verify colors reference CSS variables correctly

## Dependencies

- Story 02-001 (CSS Variables)
- Story 02-002 (Typography)

## Notes

- Use 'var(--*)' syntax so changes to CSS variables reflect everywhere
- Keep plugins minimal for faster builds
