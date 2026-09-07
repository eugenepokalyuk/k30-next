'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { RippleGrid } from '@/components/ui';
import { useTheme } from '@/lib/hooks';

import classes from './PageBackground.module.scss';

const PARALLAX = 120;

const GridColor = { dark: '#0dcaf7', light: '#0dcaf7' };

const GRID_OPACITY = 0.8;

export const PageBackground: FC = () => {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -PARALLAX]);

  if (reducedMotion) return null;

  const light = theme === 'light';

  return (
    <motion.div
      className={clsx(classes.background, { [classes.ink]: light })}
      style={{ y }}
      aria-hidden
    >
      <RippleGrid
        enableRainbow={false}
        gridColor={light ? GridColor.light : GridColor.dark}
        rippleIntensity={0.02}
        gridSize={15}
        gridThickness={28}
        fadeDistance={0.5}
        vignetteStrength={4.5}
        glowIntensity={0.1}
        opacity={GRID_OPACITY}
        gridRotation={169}
        mouseInteraction
        mouseInteractionRadius={0.6}
      />
    </motion.div>
  );
};
