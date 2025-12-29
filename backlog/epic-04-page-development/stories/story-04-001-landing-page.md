# Story 04-001: Create Landing Page

## Story

**As a** user
**I want** a welcoming landing page
**So that** I can quickly start training or learn about the app

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build the landing/home page with app branding, quick start option for returning users, learn more for new users, journey map visualization, and today's statistics.

## Acceptance Criteria

- [ ] Animated logo displays
- [ ] Quick Start button for returning users
- [ ] Learn More button opens educational modal
- [ ] Journey map shows level progression
- [ ] Today's stats display (sessions, best score, streak)
- [ ] Responsive layout

## Components

- Logo (animated)
- QuickStartCard
- LearnMoreCard
- JourneyMap
- TodayStats

## Technical Details

```typescript
// src/app/page.tsx
export default async function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-neural">
      <BackgroundOrbs />

      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        {/* Logo Section */}
        <Logo className="mb-12" />

        {/* Action Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md">
          <QuickStartCard />
          <LearnMoreCard />
        </div>

        {/* Journey Map */}
        <JourneyMap className="mb-8 w-full max-w-2xl" />

        {/* Today's Stats */}
        <TodayStats className="w-full max-w-lg" />
      </div>
    </main>
  );
}
```

## Tasks

- [ ] Create src/app/page.tsx
- [ ] Create Logo component with animation
- [ ] Create QuickStartCard component
- [ ] Create LearnMoreCard component
- [ ] Create JourneyMap component
- [ ] Create TodayStats component
- [ ] Add responsive styles
- [ ] Integrate with useProgress hook

## Dependencies

- Story 02-004 (Button)
- Story 02-005 (Card)
- Story 02-007 (Visual Effects)
- Story 03-012 (useProgress hook)
