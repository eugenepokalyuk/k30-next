'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import {
  animate,
  motion,
  type MotionStyle,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

import { Reveal, Stagger, StaggerItem } from '@/components/motion';

import classes from './CalloutCard.module.scss';
import { getBlockIcon } from '../Icons/blockIcons';

const SHIMMER_SECONDS = 8;

export interface CalloutItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface Props extends React.PropsWithChildren {
  overline: string;
  title: string;
  text?: string;
  items?: CalloutItem[];
  className?: string;
}

/**
 *  Карточка-призыв: надпись, заголовок, текст, кнопка и список доводов
 *  рядом. Одна на две секции — телеграм-канал на главной и поддержку на
 *  странице активации: обе редактируются из админки одинаково, и
 *  разъехавшись хоть отступом, они читались бы как чужие друг другу.
 *
 *  Кнопка приходит содержимым, а не пропсами: у канала своя иконка и
 *  своя подпись из кода, у поддержки — подпись из админки
 */
export const CalloutCard: FC<Props> = ({
  overline,
  title,
  text,
  items = [],
  className,
  children,
}) => {
  const angle = useMotionValue(0);
  const shimmerAngle = useTransform(angle, (value) => `${value}deg`);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) return;

    const controls = animate(angle, 360, {
      duration: SHIMMER_SECONDS,
      ease: 'linear',
      repeat: Infinity,
    });

    return () => controls.stop();
  }, [angle, reducedMotion]);

  return (
    <Reveal className={clsx(classes.card, className)}>
      {!reducedMotion && (
        <motion.span
          className={classes.shimmer}
          style={{ '--shimmer_angle': shimmerAngle } as MotionStyle}
          aria-hidden
        />
      )}

      <div className={classes.text}>
        <p className={classes.overline}>{overline}</p>

        <h2 className={classes.title}>{title}</h2>

        {text && <p className={classes.description}>{text}</p>}

        <div className={classes.actions}>{children}</div>
      </div>

      {items.length > 0 && (
        <Stagger as="ul" className={classes.benefits}>
          {items.map((item) => {
            const Icon = getBlockIcon(item.icon);

            return (
              <StaggerItem as="li" key={item.id} className={classes.benefit}>
                <span className={classes.icon}>
                  <Icon size={20} />
                </span>

                <div className={classes.benefit_text}>
                  <p className={classes.benefit_title}>{item.title}</p>
                  <p className={classes.benefit_description}>
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </Reveal>
  );
};
