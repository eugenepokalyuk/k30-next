'use client';

import React, { FC } from 'react';
import {
  animate,
  motion,
  type MotionStyle,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

import classes from './HeroSection.module.scss';

const SWEEP_SECONDS = 2.4;
const SWEEP_PAUSE = 1.8;

interface Props {
  children: string;
}

export const Highlight: FC<Props> = ({ children }) => {
  const progress = useMotionValue(0);

  const sweepX = useTransform(progress, [0, 1], ['100%', '0%']);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) return;

    const controls = animate(progress, 1, {
      duration: SWEEP_SECONDS,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: SWEEP_PAUSE,
    });

    return () => controls.stop();
  }, [progress, reducedMotion]);

  return (
    <motion.span
      className={classes.highlight}
      style={{ '--sweep_x': sweepX } as MotionStyle}
    >
      <span className={classes.label}>{children}</span>
    </motion.span>
  );
};
