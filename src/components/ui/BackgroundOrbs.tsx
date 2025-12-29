'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

export function BackgroundOrbs() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="orb orb-cyan absolute -top-[200px] -right-[200px]" />
      <div className="orb orb-magenta absolute -bottom-[200px] -left-[200px]" />
    </div>
  );
}
