'use client';

import { Card, CardContent, Slider, Toggle, Select, Skeleton } from '@/components/ui';
import { BackButton } from '@/components/layout';
import { HelpTrigger } from '@/components/help';
import { useSettings } from '@/application/hooks';
import { cn } from '@/lib/utils';

/**
 * SettingRow Component
 * Displays a single setting with label, help trigger, and control
 */
function SettingRow({
  label,
  helpKey,
  description,
  children,
}: {
  label: string;
  helpKey: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 border-b border-border-subtle last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-primary font-medium">{label}</span>
          <HelpTrigger contentKey={helpKey} side="right" />
        </div>
      </div>
      {description && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
      <div className="mt-1">{children}</div>
    </div>
  );
}

/**
 * Loading skeleton for settings
 */
function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="py-4 border-b border-border-subtle">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const { settings, loading, updateSetting, resetSettings } = useSettings();

  const sessionLengthOptions = [
    { value: 15, label: '15 trials' },
    { value: 20, label: '20 trials' },
    { value: 25, label: '25 trials' },
    { value: 30, label: '30 trials' },
  ];

  const formatDuration = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <main id="main-content" className="min-h-screen p-6 pb-20">
      <div className="max-w-lg mx-auto">
        <BackButton href="/" className="mb-6" />

        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary mb-8">
          Customize your training experience
        </p>

        {loading || !settings ? (
          <Card>
            <CardContent>
              <SettingsLoadingSkeleton />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Training Settings */}
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Training
                </h2>

                <SettingRow
                  label="Trial Duration"
                  helpKey="setting-trial-duration"
                  description="Time each stimulus is shown"
                >
                  <Slider
                    value={settings.trialDuration}
                    min={2000}
                    max={4000}
                    step={250}
                    onChange={(value) => updateSetting('trialDuration', value)}
                    formatValue={formatDuration}
                  />
                </SettingRow>

                <SettingRow
                  label="Session Length"
                  helpKey="setting-session-length"
                  description="Number of trials per session"
                >
                  <Select
                    value={settings.sessionLength}
                    options={sessionLengthOptions}
                    onChange={(value) =>
                      updateSetting('sessionLength', value as number)
                    }
                  />
                </SettingRow>

                <SettingRow
                  label="Adaptive Mode"
                  helpKey="setting-adaptive-mode"
                  description="Auto-adjust difficulty based on performance"
                >
                  <Toggle
                    checked={settings.adaptiveMode}
                    onChange={(e) =>
                      updateSetting('adaptiveMode', e.target.checked)
                    }
                  />
                </SettingRow>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Display
                </h2>

                <SettingRow
                  label="History Helper"
                  helpKey="setting-history-helper"
                  description="Show recent stimuli during training"
                >
                  <Toggle
                    checked={settings.showHistoryHelper}
                    onChange={(e) =>
                      updateSetting('showHistoryHelper', e.target.checked)
                    }
                  />
                </SettingRow>

                <SettingRow
                  label="Show Briefing"
                  helpKey="setting-show-briefing"
                  description="Display instructions before sessions"
                >
                  <Toggle
                    checked={settings.showBriefing}
                    onChange={(e) =>
                      updateSetting('showBriefing', e.target.checked)
                    }
                  />
                </SettingRow>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Audio
                </h2>

                <SettingRow
                  label="Sound Enabled"
                  helpKey="setting-sound-enabled"
                  description="Enable audio stimuli and effects"
                >
                  <Toggle
                    checked={settings.soundEnabled}
                    onChange={(e) =>
                      updateSetting('soundEnabled', e.target.checked)
                    }
                  />
                </SettingRow>

                <SettingRow
                  label="Volume"
                  helpKey="setting-volume"
                  description="Audio volume level"
                >
                  <Slider
                    value={settings.volume}
                    min={0}
                    max={100}
                    step={5}
                    onChange={(value) => updateSetting('volume', value)}
                    formatValue={(v) => `${v}%`}
                    disabled={!settings.soundEnabled}
                  />
                </SettingRow>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <div className="pt-4">
              <button
                onClick={resetSettings}
                className={cn(
                  'w-full py-3 px-4 rounded-xl',
                  'text-text-secondary hover:text-text-primary',
                  'border border-border-default hover:border-border-hover',
                  'bg-transparent hover:bg-surface-subtle',
                  'transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan'
                )}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
