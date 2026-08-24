'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { CheckIcon } from '@/components/ui';

import classes from './HeroVisual.module.scss';

/** Строки разбора ключа. Код и сервис — образец формата, а не реальный
 *  ключ: настоящие коды одноразовые, и печатать их в макете нечего. */
const rows = [
  { label: 'Провайдер', value: 'найден' },
  { label: 'Сервис', value: 'Claude Pro' },
  { label: 'Аккаунт', value: 'подтверждён' },
];

/** Разбор ключа справа от заголовка — объясняет, что происходит после
 *  ввода кода. */
export const HeroVisual: FC = () => (
  <motion.div
    className={classes.visual}
    // Тот же маркер, что у Reveal: карточка тоже приезжает в html с
    // opacity 0, и без JS её должен вернуть запасной стиль из layout.
    data-reveal=""
    initial={{ opacity: 0, y: 24, rotateX: 6 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: duration.slow, ease, delay: 0.25 }}
    aria-hidden
  >
    <div className={classes.card}>
      <div className={classes.top}>
        <span className={classes.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={classes.status}>Проверка ключа</span>
      </div>

      <p className={classes.code}>K30-8SHA-8W0P-7WTQRD-N</p>

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
        Подписка активна
      </motion.p>
    </div>
  </motion.div>
);
