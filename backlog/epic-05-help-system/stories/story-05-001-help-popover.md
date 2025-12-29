# Story 05-001: Create HelpPopover Component

## Story

**As a** user
**I want** informative help popovers
**So that** I can understand features without leaving the page

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build the HelpPopover component using Radix UI Popover with custom styling, "Why It Matters" section, pro tips, and optional tutorial video links.

## Acceptance Criteria

- [ ] Popover opens on trigger click
- [ ] Header with icon and title
- [ ] Description text
- [ ] "Why It Matters" callout box
- [ ] Pro tip section
- [ ] Optional video link
- [ ] Close button and "Got it" action
- [ ] Keyboard accessible (Escape to close)
- [ ] Animated entrance/exit

## Technical Details

See Phase 5 specification for full implementation. Key structure:

```typescript
interface PopoverContent {
  icon?: string;
  title: string;
  description: string;
  whyItMatters?: string;
  proTip?: string;
  videoUrl?: string;
}

interface HelpPopoverProps {
  children: React.ReactNode;
  content: PopoverContent;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}
```

## Tasks

- [ ] Create src/components/ui/HelpPopover.tsx
- [ ] Use Radix UI Popover primitive
- [ ] Add Framer Motion animations
- [ ] Style with glassmorphism effect
- [ ] Add "Why It Matters" section styling
- [ ] Add pro tip styling
- [ ] Test keyboard navigation
- [ ] Export from components index

## Dependencies

- Story 02-003 (Tailwind Config)
- Radix UI Popover installed
