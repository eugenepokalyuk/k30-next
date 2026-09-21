'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Notice } from '@/components/ui';
import { useActivationPolling } from '@/lib/hooks';
import type { ActivationDto } from '@/store/api/types';
import { ActivationLongWaitSeconds, SupportTelegram } from '@/utils/consts';

import classes from './ProgressStep.module.scss';

interface Props {
  activation: ActivationDto;
  onUpdate: (activation: ActivationDto) => void;
}

export const ProgressStep: FC<Props> = ({ activation, onUpdate }) => {
  const { activation: fresh, elapsed } = useActivationPolling(
    activation.id,
    activation,
  );

  React.useEffect(() => {
    if (fresh && fresh !== activation) onUpdate(fresh);
  }, [fresh, activation, onUpdate]);

  const current = fresh ?? activation;
  const isQueued = current.status === 'pending';
  const isLong = elapsed > ActivationLongWaitSeconds;

  return (
    <motion.div
      className={classes.progress}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease }}
    >
      <div className={classes.head}>
        <span className={classes.spinner} aria-hidden="true" />
        <div className={classes.headings}>
          <p className={classes.title} role="status" aria-live="polite">
            {current.status_label}
          </p>
          <p className={classes.subtitle}>
            {isQueued && current.queue_position
              ? `Вы ${current.queue_position}-й в очереди.`
              : 'Обычно это занимает от 30 секунд до двух минут.'}
          </p>
        </div>
        <span className={classes.timer} aria-hidden="true">
          {formatElapsed(elapsed)}
        </span>
      </div>

      {current.message && <p className={classes.message}>{current.message}</p>}

      {isLong && (
        <Notice tone="info" title="Идёт дольше обычного">
          Ждать у экрана необязательно — активация продолжается на сервере.
          Сохраните ссылку на эту страницу и вернитесь позже: она покажет итог.
          Если через час ничего не изменится,{' '}
          <a href={SupportTelegram} target="_blank" rel="noopener noreferrer">
            напишите в поддержку
          </a>
          .
        </Notice>
      )}

      <p className={classes.warning}>
        Не закрывайте и не обновляйте страницу без нужды — но если закроете,
        ничего не потеряется: активация идёт на сервере.
      </p>

    </motion.div>
  );
};

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}
