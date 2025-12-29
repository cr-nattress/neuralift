'use client';

import { use } from 'react';
import Link from 'next/link';
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs';
import { BackButton } from '@/components/layout/BackButton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ControlInstructions } from '@/components/training/ControlInstructions';
import { SessionInfo } from '@/components/training/SessionInfo';
import { getLevelById } from '@neuralift/core';

interface BriefingPageProps {
  params: Promise<{ levelId: string }>;
}

export default function BriefingPage({ params }: BriefingPageProps) {
  const { levelId } = use(params);
  const level = getLevelById(levelId);

  if (!level) {
    return (
      <main id="main-content" className="min-h-screen bg-gradient-neural flex items-center justify-center">
        <BackgroundOrbs />
        <Card variant="elevated" padding="lg" className="max-w-md">
          <CardContent className="text-center">
            <p className="text-text-primary text-lg mb-4">Level not found</p>
            <Link href="/levels">
              <Button>Back to Levels</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'single-position':
        return 'Position Only';
      case 'single-audio':
        return 'Audio Only';
      case 'dual':
        return 'Dual Mode';
      default:
        return mode;
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-gradient-neural p-6 flex flex-col items-center justify-center">
      <BackgroundOrbs />

      <div className="w-full max-w-2xl">
        <BackButton href="/levels" label="Back to Levels" className="mb-6" />

        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Session Briefing</CardTitle>
            <CardDescription className="text-lg">
              {level.name} • {getModeLabel(level.mode)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Goal */}
            <div className="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
              <p className="text-text-primary text-center">
                <span className="font-semibold">Goal:</span> {level.description}
              </p>
            </div>

            {/* Controls */}
            <ControlInstructions mode={level.mode} nBack={level.nBack} />

            {/* Session Info */}
            <SessionInfo trialCount={20} trialDurationMs={3000} />

            {/* Tips */}
            <div className="p-4 rounded-xl bg-surface-subtle">
              <h3 className="font-semibold text-text-primary mb-2">Tips</h3>
              <ul className="space-y-1 text-text-secondary text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent-cyan">•</span>
                  Focus on the rhythm - each trial is timed
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-cyan">•</span>
                  Don&apos;t guess - only respond when you&apos;re confident
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-cyan">•</span>
                  Stay relaxed - tension reduces performance
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Link href={`/train/${levelId}/session`} className="w-full">
              <Button size="lg" fullWidth>Begin Session</Button>
            </Link>
            <p className="text-text-tertiary text-xs text-center">
              Press Enter or click to start
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
