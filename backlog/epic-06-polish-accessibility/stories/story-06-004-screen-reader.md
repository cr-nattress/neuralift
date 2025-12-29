# Story 06-004: Add Screen Reader Support

## Story

**As a** screen reader user
**I want** the app to announce game events
**So that** I can use the training effectively

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Implement ARIA labels, roles, and live regions to make the app fully accessible to screen reader users.

## Acceptance Criteria

- [ ] All buttons have aria-labels
- [ ] Grid has role="grid" with cell labels
- [ ] Trial events announced via live region
- [ ] Results announced on completion
- [ ] Navigation landmarks present
- [ ] Form inputs labeled

## Technical Details

```typescript
// LiveRegion component
export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      setTimeout(() => setAnnouncement(''), 1000);
    }
  }, [message]);

  return (
    <div role="status" aria-live={politeness} aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}

// Usage during training
<LiveRegion message={`Trial ${trial}: Position ${positionName}, Letter ${letter}`} />
```

## Tasks

- [ ] Create LiveRegion component
- [ ] Add ARIA labels to all interactive elements
- [ ] Add role="grid" to training grid
- [ ] Add navigation landmarks (main, nav)
- [ ] Announce trial events
- [ ] Announce results
- [ ] Test with VoiceOver/NVDA

## Dependencies

- All pages built (Epic 04)
