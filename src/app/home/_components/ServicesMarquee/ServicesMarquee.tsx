'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { useServicesQuery } from '@/store/api/k30Api';

import classes from './ServicesMarquee.module.scss';

const SECONDS_PER_ITEM = 4;

/**
 *  За цикл лента уезжает на одну копию списка, поэтому копии обязаны
 *  перекрывать всю видимую ширину — иначе в конце круга зияет пустота
 */
const MIN_ITEMS = 24;

const repeatCount = (count: number) =>
  Math.min(12, Math.max(4, Math.ceil(MIN_ITEMS / count)));

/** Тот же запрос, что и у секции «Сервисы»: RTK Query отдаёт из кеша */
export const ServicesMarquee: FC = () => {
  const { data } = useServicesQuery();

  if (!data?.length) return null;

  const repeats = repeatCount(data.length);
  const items = Array.from({ length: repeats }, () => data).flat();

  return (
    <div className={classes.marquee} aria-hidden>
      <motion.div
        className={classes.track}
        animate={{ x: ['0%', `-${100 / repeats}%`] }}
        transition={{
          // По одной копии: от их числа скорость зависеть не должна
          duration: data.length * SECONDS_PER_ITEM,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {items.map((service, index) => (
          <span
            key={`${service.slug}-${index}`}
            className={classes.item}
            style={
              service.accent_color
                ? ({ '--accent': service.accent_color } as React.CSSProperties)
                : undefined
            }
          >
            <span className={classes.dot} />
            {service.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
