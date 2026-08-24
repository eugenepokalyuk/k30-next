'use client';

import React, { FC, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

import { duration, ease, viewport } from './tokens';

const tags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  section: motion.section,
  header: motion.header,
  aside: motion.aside,
} as const;

export type MotionTag = keyof typeof tags;

interface Props extends PropsWithChildren {
  as?: MotionTag;
  className?: string;
  /** Задержка в секундах — чтобы соседние блоки не выезжали разом. */
  delay?: number;
  /** Сдвиг снизу. 0 — только проявление, без движения. */
  y?: number;
}

/** Блок, который проявляется, когда доезжает до экрана.
 *
 *  Обёртка, а не хук: внутрь приходит отрисованный на сервере children,
 *  клиентским становится только контейнер с анимацией. */
export const Reveal: FC<Props> = ({
  as = 'div',
  className,
  delay = 0,
  y = 16,
  children,
}) => {
  const Tag = tags[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      // Метка для запасного стиля в <noscript>: до появления блок
      // отрисован с opacity 0 прямо в html, и без работающего JS он
      // так и остался бы невидимым.
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease, delay }}
    >
      {children}
    </Tag>
  );
};
