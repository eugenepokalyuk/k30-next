'use client';

import React, { FC } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { RippleGrid } from '@/components/ui';

import classes from './PageBackground.module.scss';

const PARALLAX = 120;

export const PageBackground: FC = () => {
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -PARALLAX]);

  if (reducedMotion) return null;

  return (
    <motion.div className={classes.background} style={{ y }} aria-hidden>
      <RippleGrid
        enableRainbow={false}
        gridColor="#0dcaf7"
        rippleIntensity={0.02}
        gridSize={15}
        gridThickness={28}
        fadeDistance={0.5}
        vignetteStrength={4.5}
        glowIntensity={0.1}
        opacity={0.8}
        gridRotation={169}
        mouseInteraction
        mouseInteractionRadius={0.6}
      />
    </motion.div>
  );
};
