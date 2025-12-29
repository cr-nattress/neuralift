# Story 04-006: Create Settings Page

## Story

**As a** user
**I want** to customize my training settings
**So that** I can adjust the experience to my preferences

## Points: 3

## Priority: High

## Status: TODO

## Description

Build the settings page with controls for trial duration, session length, adaptive mode, history helper, briefing display, sound settings, and volume.

## Acceptance Criteria

- [ ] Trial duration slider (2.0s - 4.0s)
- [ ] Session length selector (15, 20, 25, 30)
- [ ] Adaptive mode toggle
- [ ] History helper toggle
- [ ] Show briefing toggle
- [ ] Sound enabled toggle
- [ ] Volume slider
- [ ] Settings persist to database
- [ ] Help icons for each setting

## Technical Details

```typescript
// src/app/settings/page.tsx
export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  // Load settings on mount
  useEffect(() => {
    db.settings.get(1).then(setSettings);
  }, []);

  const updateSetting = async (key: string, value: any) => {
    const updated = { ...settings, [key]: value, updated: new Date() };
    await db.settings.put(updated);
    setSettings(updated);
  };

  if (!settings) return <LoadingSkeleton />;

  return (
    <main className="min-h-screen p-6">
      <BackButton href="/" />
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-lg mx-auto space-y-6">
        <SettingRow
          label="Trial Duration"
          helpKey="setting-trial-duration"
          control={
            <Slider
              min={2000}
              max={4000}
              step={250}
              value={settings.trialDuration}
              onChange={(v) => updateSetting('trialDuration', v)}
            />
          }
        />

        <SettingRow
          label="Session Length"
          helpKey="setting-session-length"
          control={
            <Select
              value={settings.sessionLength}
              options={[15, 20, 25, 30]}
              onChange={(v) => updateSetting('sessionLength', v)}
            />
          }
        />

        {/* Additional settings... */}
      </div>
    </main>
  );
}
```

## Components

- SettingRow
- Slider
- Select
- Toggle

## Tasks

- [ ] Create src/app/settings/page.tsx
- [ ] Create SettingRow component
- [ ] Create Slider component
- [ ] Create Toggle component
- [ ] Integrate with Dexie settings table
- [ ] Add HelpTrigger to each setting
- [ ] Test persistence

## Dependencies

- Story 02-004 (Button)
- Story 03-003 (Dexie Database)
