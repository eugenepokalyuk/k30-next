'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { useServicesQuery } from '@/store/api/k30Api';

import classes from './ServicesMarquee.module.scss';

/** Скорость: столько секунд на один сервис в ленте. Чем длиннее список,
 *  тем дольше проход — иначе с ростом каталога строка разгонялась бы. */
const SECONDS_PER_ITEM = 4;

/** Сколько названий должно быть в ленте, чтобы её хватило на широкий
 *  экран. За цикл лента уезжает ровно на одну копию списка, поэтому
 *  остальные копии обязаны перекрывать всю видимую ширину — иначе за
 *  последним названием появляется пустота до начала следующего круга.
 *  Двух копий хватало только на телефон. */
const MIN_ITEMS = 24;

/** Копий не меньше четырёх (чтобы лента шла плотно даже при десятке
 *  сервисов) и не больше двенадцати (дальше это просто лишние узлы). */
const repeatCount = (count: number) =>
  Math.min(12, Math.max(4, Math.ceil(MIN_ITEMS / count)));

/** Бегущая строка с сервисами, которые сейчас в продаже.
 *
 *  Список берётся из того же запроса, что и секция «Сервисы» ниже:
 *  RTK Query отдаёт его из кеша, второго обращения к бэкенду нет.
 *
 *  Лента декоративная и продублирована ради бесшовной прокрутки,
 *  поэтому она скрыта от скринридеров — те же названия читаются в
 *  секции «Сервисы» обычным списком.
 */
export const ServicesMarquee: FC = () => {
  const { data } = useServicesQuery();

  // Пока список не приехал или пуст — полосы нет вовсе. Пустая рамка
  // на первом экране выглядела бы как незагрузившийся блок.
  if (!data?.length) return null;

  // Одинаковые копии подряд: когда лента уезжает ровно на одну копию,
  // следующая оказывается там, где была предыдущая, и стык не виден.
  const repeats = repeatCount(data.length);
  const items = Array.from({ length: repeats }, () => data).flat();

  return (
    <div className={classes.marquee} aria-hidden>
      <motion.div
        className={classes.track}
        animate={{ x: ['0%', `-${100 / repeats}%`] }}
        transition={{
          // Длительность считается по одной копии, а не по всей ленте:
          // от числа копий скорость не должна зависеть.
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
