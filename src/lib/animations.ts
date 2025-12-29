import { Variants, Transition } from 'framer-motion';

// Standard transitions
export const transitions = {
  // Quick micro-interactions
  fast: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
  } satisfies Transition,

  // Standard UI transitions
  normal: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  } satisfies Transition,

  // Smooth page transitions
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  } satisfies Transition,

  // Bouncy spring for playful elements
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } satisfies Transition,

  // Gentle spring for subtle motion
  gentleSpring: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  } satisfies Transition,
} as const;

// Common animation variants
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const slideInFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: transitions.fast,
  },
};

export const slideInFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: transitions.fast,
  },
};

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Quick stagger for fast lists
export const quickStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
  },
};

// Grid cell animation (for training grid)
export const gridCell: Variants = {
  inactive: {
    scale: 1,
    backgroundColor: 'var(--color-surface-subtle)',
  },
  active: {
    scale: 1.05,
    backgroundColor: 'var(--color-accent-cyan)',
    transition: transitions.spring,
  },
  flash: {
    scale: [1, 1.1, 1],
    backgroundColor: ['var(--color-surface-subtle)', 'var(--color-accent-cyan)', 'var(--color-surface-subtle)'],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1],
    },
  },
};

// Button press animation
export const buttonPress: Variants = {
  rest: {
    scale: 1,
  },
  pressed: {
    scale: 0.97,
    transition: transitions.fast,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
};

// Pulse animation for attention
export const pulse: Variants = {
  initial: {
    scale: 1,
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Score reveal animation
export const scoreReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: 0.2,
    },
  },
};

// Countdown animation
export const countdown: Variants = {
  initial: {
    opacity: 0,
    scale: 2,
  },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [2, 1, 1, 0.8],
    transition: {
      duration: 1,
      times: [0, 0.1, 0.8, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
  },
};

// Progress bar fill animation
export const progressFill: Variants = {
  empty: {
    scaleX: 0,
    originX: 0,
  },
  fill: (progress: number) => ({
    scaleX: progress,
    originX: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Modal/overlay variants
export const modalOverlay: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.fast,
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    transition: transitions.gentleSpring,
  },
};

// Icon spin (for loading)
export const iconSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Shake animation (for errors)
export const shake: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

// Success checkmark draw
export const checkmarkDraw: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 0.5,
        ease: 'easeOut',
      },
      opacity: {
        duration: 0.1,
      },
    },
  },
};
