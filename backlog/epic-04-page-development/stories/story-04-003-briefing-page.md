# Story 04-003: Create Briefing Page

## Story

**As a** user
**I want** a pre-session briefing
**So that** I understand the controls before training

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Build the pre-session briefing page showing level information, controls explanation, example sequence, and session parameters.

## Acceptance Criteria

- [ ] Level name and mode displayed
- [ ] Control instructions shown (position/audio buttons)
- [ ] Keyboard shortcuts displayed
- [ ] Session length and trial duration shown
- [ ] Quick example sequence
- [ ] Begin Session button
- [ ] Skip briefing checkbox

## Technical Details

```typescript
// src/app/train/[levelId]/page.tsx
interface BriefingPageProps {
  params: { levelId: string };
}

export default function BriefingPage({ params }: BriefingPageProps) {
  const level = LEVELS[params.levelId];

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Session Briefing</CardTitle>
          <CardDescription>{level.name} - {level.nBack}-Back</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <ControlInstructions mode={level.mode} nBack={level.nBack} />
          <SessionInfo trialCount={level.defaultTrialCount} duration={level.trialDuration} />
          <ExampleSequence nBack={level.nBack} mode={level.mode} />
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button size="lg" fullWidth asChild>
            <Link href={`/train/${params.levelId}/session`}>Begin Session</Link>
          </Button>
          <SkipBriefingCheckbox />
        </CardFooter>
      </Card>
    </main>
  );
}
```

## Components

- ControlInstructions
- SessionInfo
- ExampleSequence
- SkipBriefingCheckbox

## Tasks

- [ ] Create src/app/train/[levelId]/page.tsx
- [ ] Create ControlInstructions component
- [ ] Create SessionInfo component
- [ ] Create ExampleSequence with animation
- [ ] Add skip preference to settings
- [ ] Test with all training modes

## Dependencies

- Story 02-004 (Button)
- Story 02-005 (Card)
