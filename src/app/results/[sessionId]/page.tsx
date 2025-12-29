'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';
import {
  ScoreCircle,
  StatComparison,
  StatsTable,
  CoachNotes,
} from '@/components/results';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

// Demo session data (will be replaced with real data from session repository)
function getDemoSession() {
  return {
    sessionId: 'demo',
    levelId: 'dual-2',
    levelName: 'Dual 2-Back',
    combinedAccuracy: 78,
    positionStats: {
      accuracy: 82,
      hits: 8,
      misses: 2,
      falseAlarms: 1,
      correctRejections: 9,
      dPrime: 1.84,
    },
    audioStats: {
      accuracy: 74,
      hits: 7,
      misses: 3,
      falseAlarms: 2,
      correctRejections: 8,
      dPrime: 1.42,
    },
  };
}

function getDemoFeedback() {
  return {
    feedback:
      "Great session! Your position accuracy is strong, showing good spatial memory. Your audio recognition could use a bit more focus - try to vocalize the letters in your head as you hear them.",
    recommendations: [
      'Practice audio-only mode to strengthen letter recognition',
      'Try to maintain a steady rhythm during trials',
      'Take a 5-minute break before your next session',
    ],
    encouragement:
      "You're making solid progress! Consistency is key - keep up the daily practice.",
  };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = use(params);

  // Get session data (demo for now)
  const session = getDemoSession();
  const feedback = getDemoFeedback();

  return (
    <main id="main-content" className="min-h-screen bg-gradient-neural py-8 px-4">
      <BackgroundOrbs />

      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Session Complete!
          </h1>
          <p className="text-text-secondary">{session.levelName}</p>
        </motion.div>

        {/* Score Circle */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ScoreCircle accuracy={session.combinedAccuracy} />
        </motion.div>

        {/* Position vs Audio Comparison */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatComparison
            positionAccuracy={session.positionStats.accuracy}
            audioAccuracy={session.audioStats.accuracy}
          />
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="default" padding="md" className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <StatsTable
                positionStats={session.positionStats}
                audioStats={session.audioStats}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Coach Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="default" padding="md" className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent-cyan/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-accent-cyan"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Coach&apos;s Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoachNotes
                feedback={feedback.feedback}
                recommendations={feedback.recommendations}
                encouragement={feedback.encouragement}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href={`/train/${session.levelId}`} className="flex-1">
            <Button variant="secondary" fullWidth>
              Train Again
            </Button>
          </Link>
          <Link href="/levels" className="flex-1">
            <Button variant="secondary" fullWidth>
              Choose Level
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button fullWidth>Done</Button>
          </Link>
        </motion.div>

        {/* Session ID (debug info) */}
        <p className="text-center text-text-muted text-xs mt-8">
          Session: {sessionId}
        </p>
      </div>
    </main>
  );
}
