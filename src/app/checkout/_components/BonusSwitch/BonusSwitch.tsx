'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { CheckIcon } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';

import classes from './BonusSwitch.module.scss';
import type { Bonus } from './useBonus';

interface Props {
  bonus: Bonus;
}

export const BonusSwitch: FC<Props> = ({ bonus }) => {
  if (!bonus.isAvailable) return null;

  const available = formatPrice(bonus.available);
  const balance = formatPrice(bonus.balance);

  return (
    <button
      type="button"
      className={clsx(classes.row, bonus.isOn && classes.on)}
      onClick={bonus.toggle}
      aria-pressed={bonus.isOn}
    >
      <span className={clsx(classes.box, bonus.isOn && classes.box_on)}>
        <AnimatePresence initial={false}>
          {bonus.isOn && (
            <motion.span
              className={classes.tick}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: duration.fast, ease }}
            >
              <CheckIcon size={14} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className={classes.text}>
        <span className={classes.title}>Списать бонусы</span>
        <span className={classes.note}>
          {`Доступно ${available} из ${balance} · вместо промокода`}
        </span>
      </span>
    </button>
  );
};
