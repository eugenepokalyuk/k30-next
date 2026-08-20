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
}

/** Список, элементы которого появляются по очереди.
 *
 *  Очередь задаётся вариантами на родителе, а не задержкой на каждом
 *  элементе: количество карточек приходит с бэкенда (сервисы), и
 *  считать задержки по индексу пришлось бы в разметке.
 */
export const Stagger: FC<Props> = ({ as = 'div', className, children }) => {
  const Tag = tags[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </Tag>
  );
};

/** Элемент такого списка. Наследует состояние от родителя — своих
 *  initial/animate у него нет намеренно. */
export const StaggerItem: FC<Props> = ({ as = 'div', className, children }) => {
  const Tag = tags[as] as typeof motion.div;

  return (
    <Tag className={className} data-reveal="" variants={fadeUp}>
      {children}
    </Tag>
  );
};
