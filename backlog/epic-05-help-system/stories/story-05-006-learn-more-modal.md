# Story 05-006: Create LearnMoreModal

## Story

**As a** new user
**I want** to learn about dual n-back
**So that** I understand the science behind the training

## Points: 3

## Priority: High

## Status: TODO

## Description

Build the LearnMoreModal that provides educational content about dual n-back training, including the science, how it works, benefits, and recommended practice.

## Acceptance Criteria

- [ ] Opens from landing page "Learn More" button
- [ ] Sections: Science, How It Works, Benefits, Practice
- [ ] Clean, scannable layout
- [ ] Close button and escape key
- [ ] Animated entrance

## Technical Details

```typescript
// src/components/help/LearnMoreModal.tsx
interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearnMoreModal({ open, onOpenChange }: LearnMoreModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full max-h-[85vh] overflow-auto rounded-2xl bg-bg-elevated p-8">
          <Dialog.Title>What is Dual N-Back Training?</Dialog.Title>

          <Section icon={<Brain />} title="The Science" content="..." />
          <Section icon={<Target />} title="How It Works" content="..." />
          <Section icon={<TrendingUp />} title="Benefits" content="..." />
          <Section icon={<Clock />} title="Recommended Practice" content="..." />

          <Dialog.Close className="absolute top-4 right-4">
            <X size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Tasks

- [ ] Create src/components/help/LearnMoreModal.tsx
- [ ] Use Radix UI Dialog
- [ ] Add section content
- [ ] Add animations
- [ ] Integrate with landing page
- [ ] Test keyboard navigation

## Dependencies

- Radix UI Dialog installed
- Story 02-003 (Tailwind Config)
