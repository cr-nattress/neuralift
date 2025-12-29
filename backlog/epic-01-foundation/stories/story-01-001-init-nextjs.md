# Story 01-001: Initialize Next.js Project

## Story

**As a** developer
**I want** a properly configured Next.js 14+ project
**So that** I have a solid foundation for building the application

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Initialize a new Next.js 14+ project with App Router, React 18+, and all necessary base dependencies for the Neuralift application.

## Acceptance Criteria

- [ ] Next.js 14+ project created with App Router
- [ ] React 18+ installed
- [ ] Tailwind CSS configured
- [ ] PostCSS and Autoprefixer set up
- [ ] ESLint configured with Next.js recommended rules
- [ ] Prettier configured with Tailwind plugin
- [ ] Base folder structure created
- [ ] Development server runs without errors

## Technical Details

### Commands

```bash
npx create-next-app@latest neuralift --typescript --tailwind --eslint --app --src-dir
```

### Dependencies to Install

```bash
# Core
npm install framer-motion

# Radix UI Primitives
npm install @radix-ui/react-popover @radix-ui/react-dialog @radix-ui/react-progress @radix-ui/react-tooltip

# State & Storage
npm install zustand dexie

# Audio
npm install howler

# Utilities
npm install nanoid zod clsx tailwind-merge class-variance-authority

# Icons
npm install lucide-react
```

### Dev Dependencies

```bash
npm install -D prettier prettier-plugin-tailwindcss @types/howler
```

### Files to Create/Modify

- `package.json` - Add scripts
- `.prettierrc` - Prettier config
- `.eslintrc.json` - ESLint config
- `src/lib/utils.ts` - cn() utility function

## Tasks

- [ ] Run create-next-app with specified options
- [ ] Install all dependencies
- [ ] Configure Prettier with Tailwind plugin
- [ ] Update ESLint config
- [ ] Create utils.ts with cn() function
- [ ] Verify dev server starts
- [ ] Verify build completes

## Notes

- Use npm (not yarn or pnpm) for consistency
- Ensure Node.js 18+ is being used
