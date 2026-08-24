'use client';

import React, { FC, PropsWithChildren } from 'react';
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

interface Props extends PropsWithChildren {
  as?: MotionTag;
  className?: string;
  /** Инлайновые переменные вроде --accent: цвет сервиса приходит из
   *  админки, и в классах его не выразить. */
  style?: React.CSSProperties;
}

/** Список, элементы которого появляются по очереди. Очередь задаётся
 *  вариантами на родителе: число карточек приходит с бэкенда. */
export const Stagger: FC<Props> = ({ as = 'div', className, style, children }) => {
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

/** Элемент такого списка. Своих initial/animate нет намеренно —
 *  состояние наследуется от родителя. */
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
