'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  target?: string; // CSS selector for element to highlight
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Neuralift!',
    description:
      "Let's take a quick tour to help you get started with dual n-back training.",
    position: 'center',
  },
  {
    id: 'what-is-nback',
    title: 'What is N-Back?',
    description:
      "N-back is a cognitive training exercise where you match current stimuli to ones from N steps ago. It's proven to improve working memory.",
    position: 'center',
  },
  {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Click here to jump straight into training. We recommend starting with 1-back levels.',
    target: '[data-tour="quick-start"]',
    position: 'bottom',
  },
  {
    id: 'levels',
    title: 'Choose Your Level',
    description:
      'Select from different training modes: Position (spatial), Audio (letters), or Dual (both together).',
    target: '[data-tour="journey-map"]',
    position: 'top',
  },
  {
    id: 'progress',
    title: 'Track Your Progress',
    description:
      'Your stats show sessions completed, best scores, and training streaks. Consistency is key!',
    target: '[data-tour="today-stats"]',
    position: 'top',
  },
  {
    id: 'done',
    title: "You're Ready!",
    description:
      "That's all you need to know to get started. Good luck with your training!",
    position: 'center',
  },
];

const TOUR_STORAGE_KEY = 'neuralift-tour-completed';

interface GuidedTourProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function GuidedTour({ onComplete, forceShow = false }: GuidedTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if tour should show
  useEffect(() => {
    if (forceShow) {
      setIsActive(true);
      return undefined;
    }

    const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasCompletedTour) {
      // Small delay before showing tour
      const timer = setTimeout(() => setIsActive(true), 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [forceShow]);

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep]);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setIsActive(false);
    onComplete?.();
  }, [onComplete]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleNext, handlePrev, handleSkip]);

  if (!isActive || !step) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm" />

        {/* Tour Card */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'w-full max-w-md rounded-2xl',
              'bg-bg-elevated border border-border-subtle',
              'shadow-2xl shadow-black/30'
            )}
          >
            {/* Progress Dots */}
            <div className="flex justify-center gap-1.5 pt-4">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors duration-200',
                    index === currentStep
                      ? 'bg-accent-cyan'
                      : index < currentStep
                        ? 'bg-accent-cyan/50'
                        : 'bg-surface-subtle'
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-text-primary mb-3">
                {step.title}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Skip tour
              </button>

              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button variant="ghost" size="sm" onClick={handlePrev}>
                    Back
                  </Button>
                )}
                <Button size="sm" onClick={handleNext}>
                  {isLastStep ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manually trigger tour
export function useTour() {
  const [showTour, setShowTour] = useState(false);

  const startTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShowTour(true);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  }, []);

  return { showTour, startTour, resetTour, setShowTour };
}
