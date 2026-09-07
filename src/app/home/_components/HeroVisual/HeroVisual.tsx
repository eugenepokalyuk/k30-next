'use client';

import React, { FC, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { CheckIcon, TiltCard } from '@/components/ui';

import classes from './HeroVisual.module.scss';

const PARALLAX = 120;

const rows = [
  { label: 'Провайдер', value: 'найден' },
  { label: 'Сервис', value: 'Claude Pro' },
  { label: 'Аккаунт', value: 'подтверждён' },
];

export const HeroVisual: FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -PARALLAX]);

  return (
    <motion.div
      ref={visualRef}
      className={classes.visual}
      style={reducedMotion ? undefined : { y }}
      aria-hidden
    >
      <motion.div
        className={classes.appear}
        data-reveal=""
        initial={{ opacity: 0, y: 24, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: duration.slow, ease, delay: 0.25 }}
      >
        <TiltCard className={classes.scene} surfaceClassName={classes.card}>
          <div className={classes.top}>
            <span className={classes.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={classes.status}>{'Проверка ключа'}</span>
          </div>

          <p className={classes.code}>{'K30-8SHA-8W0P-7WTQRD-N'}</p>

          <ul className={classes.rows}>
            {rows.map((row, index) => (
              <motion.li
                key={row.label}
                className={classes.row}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: duration.base,
                  ease,
                  delay: 0.6 + index * 0.18,
                }}
              >
                <span className={classes.check}>
                  <CheckIcon size={14} />
                </span>

                <span className={classes.label}>{row.label}</span>

                <span className={classes.value}>{row.value}</span>
              </motion.li>
            ))}
          </ul>

          <motion.p
            className={classes.result}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease, delay: 1.2 }}
          >
            {'Подписка активна'}
          </motion.p>
        </TiltCard>
      </motion.div>
    </motion.div>
  );
};
