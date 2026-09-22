'use client';

import React, { FC } from 'react';
import {
  animate,
  motion,
  type MotionStyle,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { BlockIcon, Button, Section, TelegramIcon } from '@/components/ui';
import { useTelegramBlockQuery } from '@/store/api/k30Api';

import classes from './TelegramSection.module.scss';

const SHIMMER_SECONDS = 8;

interface Props {
  className?: string;
}

export const TelegramSection: FC<Props> = ({ className }) => {
  const { data } = useTelegramBlockQuery();

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

  if (!data?.is_enabled || !data.url) return null;

  return (
    <Section id="telegram" className={className}>
      <Reveal className={classes.card}>
        {!reducedMotion && (
          <motion.span
            className={classes.shimmer}
            style={{ '--shimmer_angle': shimmerAngle } as MotionStyle}
            aria-hidden
          />
        )}

        <div className={classes.text}>
          <p className={classes.overline}>Телеграм-канал</p>

          <h2 className={classes.title}>{data.title}</h2>

          {data.text && <p className={classes.description}>{data.text}</p>}

          <div className={classes.actions}>
            <Button href={data.url} external size="large">
              <TelegramIcon size={18} />
              Перейти в канал
            </Button>
          </div>
        </div>

        {data.items.length > 0 && (
          <Stagger as="ul" className={classes.benefits}>
            {data.items.map((item) => {
              return (
                <StaggerItem as="li" key={item.id} className={classes.benefit}>
                  <span className={classes.icon}>
                    <BlockIcon name={item.icon} size={20} />
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
    </Section>
  );
};
