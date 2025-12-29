# Story 04-005: Create Results Page

## Story

**As a** user
**I want** to see my session results
**So that** I can understand my performance

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build the post-session results page showing accuracy scores, detailed breakdown, AI-generated feedback, and action buttons.

## Acceptance Criteria

- [ ] Combined accuracy prominently displayed
- [ ] Position and audio accuracy shown separately
- [ ] Detailed breakdown (hits, misses, false alarms, d-prime)
- [ ] AI-generated coach notes displayed
- [ ] Action buttons (Train Again, Review, Done)
- [ ] Level unlock notification if applicable

## Technical Details

```typescript
// src/app/results/[sessionId]/page.tsx
import { useLLMFeedback } from '@/application/hooks/useLLMFeedback';

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const session = await getSession(params.sessionId);
  const { feedback, loading, getSessionFeedback } = useLLMFeedback();

  useEffect(() => {
    getSessionFeedback(session);
  }, [session]);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Session Complete</h1>

      {/* Score Circle */}
      <ScoreCircle
        accuracy={session.combinedAccuracy}
        className="mb-8"
      />

      {/* Position vs Audio Comparison */}
      <StatComparison
        positionAccuracy={session.positionStats.accuracy}
        audioAccuracy={session.audioStats.accuracy}
        className="mb-8"
      />

      {/* Detailed Breakdown */}
      <Card className="w-full max-w-lg mb-8">
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsTable
            positionStats={session.positionStats}
            audioStats={session.audioStats}
          />
        </CardContent>
      </Card>

      {/* Coach Notes */}
      <Card className="w-full max-w-lg mb-8">
        <CardHeader>
          <CardTitle>💬 Coach's Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-20" />
          ) : (
            <p className="text-text-secondary">{feedback?.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="secondary" asChild>
          <Link href={`/train/${session.levelId}`}>Train Again</Link>
        </Button>
        <Button asChild>
          <Link href="/">Done</Link>
        </Button>
      </div>
    </main>
  );
}
```

## Components

- ScoreCircle
- StatComparison
- StatsTable
- CoachNotes

## Tasks

- [ ] Create src/app/results/[sessionId]/page.tsx
- [ ] Create ScoreCircle component
- [ ] Create StatComparison component
- [ ] Create StatsTable component
- [ ] Integrate useLLMFeedback hook
- [ ] Add loading skeleton for AI feedback
- [ ] Handle level unlock display

## Dependencies

- Story 02-005 (Card)
- Story 03-011 (LLM Service)
- Story 03-012 (useLLMFeedback hook)
