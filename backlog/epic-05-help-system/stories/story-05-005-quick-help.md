# Story 05-005: Create QuickHelp Component

## Story

**As a** user in a training session
**I want** quick access to a reminder
**So that** I don't have to leave the session

## Points: 2

## Priority: High

## Status: TODO

## Description

Build a QuickHelp component that provides a condensed reminder of the current n-back rules during active training.

## Acceptance Criteria

- [ ] Shows current n-back rule briefly
- [ ] Position and audio match explanations
- [ ] Keyboard shortcuts displayed
- [ ] Non-intrusive placement
- [ ] Quick to dismiss

## Technical Details

```typescript
// src/components/help/QuickHelp.tsx
interface QuickHelpProps {
  nBack: number;
  mode: TrainingMode;
}

export function QuickHelp({ nBack, mode }: QuickHelpProps) {
  const content = {
    title: 'Quick Reminder',
    description: `Position Match (A): Current = ${nBack} ago\nAudio Match (L): Current = ${nBack} ago`,
    proTip: "Both, one, or neither can match—they're independent!",
  };

  return (
    <HelpPopover content={content} side="bottom">
      <button className="p-2 rounded-full hover:bg-surface-subtle" aria-label="Quick help">
        <HelpCircle size={20} className="text-text-tertiary" />
      </button>
    </HelpPopover>
  );
}
```

## Tasks

- [ ] Create src/components/help/QuickHelp.tsx
- [ ] Dynamic content based on n-back level
- [ ] Add to training session page
- [ ] Test during active session

## Dependencies

- Story 05-001 (HelpPopover)
