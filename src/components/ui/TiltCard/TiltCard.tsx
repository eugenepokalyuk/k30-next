'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { useTilt } from '@/lib/hooks';

import classes from './TiltCard.module.scss';

interface Props extends React.PropsWithChildren {
  maxTilt?: number;
  className?: string;
  surfaceClassName?: string;
}

export const TiltCard: FC<Props> = ({
  maxTilt,
  className,
  surfaceClassName,
  children,
}) => {
  const { ref, handlers, style, glare, prefersReduced } = useTilt({ maxTilt });

  return (
    <div ref={ref} className={clsx(classes.scene, className)} {...handlers}>
      <motion.div
        className={clsx(classes.card, surfaceClassName)}
        style={style}
      >
        {children}

        {!prefersReduced && (
          <motion.span
            aria-hidden
            className={classes.glare}
            style={{ left: glare.x, top: glare.y }}
          />
        )}
      </motion.div>
    </div>
  );
};
