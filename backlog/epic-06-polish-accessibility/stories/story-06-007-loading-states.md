# Story 06-007: Create Loading & Error States

## Story

**As a** user
**I want** clear feedback during loading
**So that** I know the app is working

## Points: 3

## Priority: High

## Status: TODO

## Description

Create consistent loading skeletons, error boundaries, and empty states throughout the application.

## Acceptance Criteria

- [ ] Skeleton components for all async content
- [ ] Error boundary with recovery option
- [ ] Empty states for lists
- [ ] Loading spinners for buttons
- [ ] 404 page styled

## Technical Details

```typescript
// Skeleton component
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-surface-subtle', className)} />
  );
}

// Error Boundary
export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Empty State
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary mb-6">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
```

## Tasks

- [ ] Create Skeleton component
- [ ] Create ErrorBoundary component
- [ ] Create EmptyState component
- [ ] Add skeletons to async pages
- [ ] Wrap app in ErrorBoundary
- [ ] Style 404 page
- [ ] Test error recovery

## Dependencies

- Story 02-004 (Button)
