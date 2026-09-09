'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import type { MotionTag } from './Reveal';
import { fadeUp, staggerContainer, viewport } from './tokens';

const tags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  section: motion.section,
  header: motion.header,
  aside: motion.aside,
} as const;

interface Props extends React.PropsWithChildren {
  as?: MotionTag;
  className?: string;
  style?: React.CSSProperties;
}

export const Stagger: FC<Props> = ({
  as = 'div',
  className,
  style,
  children,
}) => {
  const Tag = tags[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      style={style}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </Tag>
  );
};

export const StaggerItem: FC<Props> = ({
  as = 'div',
  className,
  style,
  children,
}) => {
  const Tag = tags[as] as typeof motion.div;

  return (
    <Tag className={className} style={style} data-reveal="" variants={fadeUp}>
      {children}
    </Tag>
  );
};
