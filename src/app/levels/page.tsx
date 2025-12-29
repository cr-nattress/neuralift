'use client';

import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs';
import { BackButton } from '@/components/layout/BackButton';
import { PhaseSection } from '@/components/levels/PhaseSection';
import { LevelCard } from '@/components/levels/LevelCard';
import { LEVELS, type LevelConfig } from '@neuralift/core';

// Phase configuration
const PHASES = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'Build your core skills with single-modality training',
    accentColor: 'cyan' as const,
    levelIds: ['position-1', 'audio-1'],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Push your limits with 2-back challenges',
    accentColor: 'magenta' as const,
    levelIds: ['position-2', 'audio-2'],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Master dual n-back for maximum cognitive benefit',
    accentColor: 'gold' as const,
    levelIds: ['dual-2', 'dual-3'],
  },
];

export default function LevelsPage() {
  // TODO: Connect to useProgress hook for real data
  const unlockedLevelIds = ['position-1', 'audio-1', 'position-2', 'audio-2'];
  const completedLevelIds = ['position-1'];
  const currentLevelId = 'audio-1';

  // Create a map for quick level lookup
  const levelMap = new Map<string, LevelConfig>();
  for (const level of LEVELS) {
    levelMap.set(level.id, level);
  }

  return (
    <main id="main-content" className="min-h-screen bg-gradient-neural">
      <BackgroundOrbs />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <BackButton href="/" label="Home" className="mb-4" />
          <h1 className="text-3xl font-bold text-text-primary text-center">
            Choose Your Training
          </h1>
          <p className="text-text-secondary text-center mt-2">
            Select a level to begin your session
          </p>
        </div>

        {/* Phase Sections */}
        {PHASES.map((phase) => {
          const phaseLevels = phase.levelIds
            .map((id) => levelMap.get(id))
            .filter((level): level is LevelConfig => level !== undefined);

          return (
            <PhaseSection
              key={phase.id}
              title={phase.title}
              description={phase.description}
              accentColor={phase.accentColor}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {phaseLevels.map((level) => (
                  <LevelCard
                    key={level.id}
                    level={level}
                    locked={!unlockedLevelIds.includes(level.id)}
                    complete={completedLevelIds.includes(level.id)}
                    recommended={level.id === currentLevelId}
                  />
                ))}
              </div>
            </PhaseSection>
          );
        })}
      </div>
    </main>
  );
}
