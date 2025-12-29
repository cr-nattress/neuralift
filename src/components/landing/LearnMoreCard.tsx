'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface LearnMoreCardProps {
  className?: string;
}

export function LearnMoreCard({ className }: LearnMoreCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        variant="interactive"
        padding="md"
        className={cn('flex-1', className)}
      >
        <CardContent className="flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-accent-magenta/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-accent-magenta"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h3 className="font-semibold text-text-primary text-lg">Learn More</h3>
            <p className="text-text-secondary text-sm mt-1">
              What is dual n-back?
            </p>
          </div>

          {/* Button */}
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setIsModalOpen(true)}
          >
            How It Works
          </Button>
        </CardContent>
      </Card>

      {/* Learn More Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <Card
            variant="elevated"
            padding="lg"
            className="relative z-10 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <CardContent>
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2
                id="modal-title"
                className="text-2xl font-bold text-text-primary mb-4"
              >
                What is Dual N-Back?
              </h2>

              <div className="space-y-4 text-text-secondary">
                <p>
                  Dual N-Back is a scientifically-validated cognitive training
                  exercise that challenges your working memory and fluid
                  intelligence.
                </p>

                <h3 className="text-lg font-semibold text-text-primary">
                  How it works:
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    You&apos;ll see a sequence of positions on a grid and hear
                    letters
                  </li>
                  <li>
                    Your task is to identify when the current position or sound
                    matches the one from N steps back
                  </li>
                  <li>
                    Starting with 1-back, the difficulty increases as you
                    improve
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-text-primary">
                  Benefits:
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Improved working memory capacity</li>
                  <li>Enhanced attention and focus</li>
                  <li>Better cognitive flexibility</li>
                  <li>Potential improvements in fluid intelligence</li>
                </ul>

                <p className="text-sm text-text-tertiary mt-6">
                  Research by Jaeggi et al. (2008) suggests regular dual n-back
                  training can lead to significant cognitive improvements.
                </p>
              </div>

              <Button
                variant="primary"
                fullWidth
                className="mt-6"
                onClick={() => setIsModalOpen(false)}
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
