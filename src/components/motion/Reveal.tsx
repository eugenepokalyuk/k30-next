'use client';

import React, { FC } from 'react';
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

interface Props extends React.PropsWithChildren {
  as?: MotionTag;
  className?: string;
  delay?: number;
  y?: number;
}

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
