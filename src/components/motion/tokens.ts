import type { Transition, Variants } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const duration = {
  fast: 0.18,
  base: 0.34,
  slow: 0.5,
} as const;

export const transition: Transition = { duration: duration.base, ease };

export const viewport = { once: true, amount: 0.2 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};
