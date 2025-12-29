# Story 05-004: Create HelpTrigger Component

## Story

**As a** user
**I want** help icons next to confusing elements
**So that** I can get help when needed

## Points: 2

## Priority: Critical

## Status: TODO

## Description

Build a reusable HelpTrigger component that renders a help icon button and opens the appropriate popover.

## Acceptance Criteria

- [ ] Renders help circle icon
- [ ] Three sizes: sm, md, lg
- [ ] Opens popover from content library
- [ ] Configurable side placement
- [ ] Doesn't interfere with adjacent content

## Technical Details

```typescript
// src/components/help/HelpTrigger.tsx
interface HelpTriggerProps {
  contentKey: keyof typeof popoverContent;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTrigger({ contentKey, className, size = 'md', side = 'top' }: HelpTriggerProps) {
  const content = popoverContent[contentKey];
  if (!content) return null;

  return (
    <HelpPopover content={content} side={side}>
      <button
        className={cn('rounded-full p-1 text-text-tertiary hover:text-text-secondary', className)}
        aria-label={`Learn more about ${content.title}`}
      >
        <HelpCircle size={sizes[size]} />
      </button>
    </HelpPopover>
  );
}
```

## Tasks

- [ ] Create src/components/help/HelpTrigger.tsx
- [ ] Implement size variants
- [ ] Add popover integration
- [ ] Add to settings, training, results pages
- [ ] Test accessibility

## Dependencies

- Story 05-001 (HelpPopover)
- Story 05-002 (Content Library)
