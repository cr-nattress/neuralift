# Story 04-007: Create Progress Page

## Story

**As a** user
**I want** to see my training history and statistics
**So that** I can track my improvement over time

## Points: 5

## Priority: High

## Status: TODO

## Description

Build the progress/statistics page showing streak information, accuracy trends, session history, and level completion status.

## Acceptance Criteria

- [ ] Current and longest streak displayed
- [ ] Accuracy trend chart (last 10 sessions)
- [ ] Session history list with key stats
- [ ] Level progress overview
- [ ] Summary statistics (total sessions, time, average)

## Technical Details

```typescript
// src/app/progress/page.tsx
export default function ProgressPage() {
  const { progress } = useProgress();
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    db.sessions.orderBy('timestamp').reverse().limit(20).toArray().then(setSessions);
  }, []);

  return (
    <main className="min-h-screen p-6">
      <BackButton href="/" />
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Streak Display */}
        <Card>
          <CardHeader>
            <CardTitle>🔥 Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakDisplay
              current={progress?.currentStreak ?? 0}
              longest={progress?.longestStreak ?? 0}
            />
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsSummary
              totalSessions={progress?.totalSessions ?? 0}
              totalTime={progress?.totalTime ?? 0}
            />
          </CardContent>
        </Card>

        {/* Accuracy Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Accuracy Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AccuracyChart sessions={sessions.slice(0, 10)} />
          </CardContent>
        </Card>

        {/* Session History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionHistory sessions={sessions} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
```

## Components

- StreakDisplay
- StatsSummary
- AccuracyChart
- SessionHistory
- LevelProgress

## Tasks

- [ ] Create src/app/progress/page.tsx
- [ ] Create StreakDisplay component
- [ ] Create StatsSummary component
- [ ] Create AccuracyChart component (simple SVG or canvas)
- [ ] Create SessionHistory list component
- [ ] Query session data from Dexie
- [ ] Add empty states

## Dependencies

- Story 02-005 (Card)
- Story 03-003 (Dexie Database)
- Story 03-012 (useProgress hook)
