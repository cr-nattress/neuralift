'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  count: number;
}

export function CountdownOverlay({ count }: CountdownOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          {count > 0 ? (
            <>
              <span className="text-8xl font-bold text-accent-cyan">
                {count}
              </span>
              <span className="text-text-secondary mt-4">Get ready...</span>
            </>
          ) : (
            <span className="text-4xl font-bold text-accent-cyan">GO!</span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
