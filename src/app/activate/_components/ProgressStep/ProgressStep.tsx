'use client';

import React, { FC, useEffect } from 'react';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Button, Notice } from '@/components/ui';
import { useActivationPolling } from '@/lib/hooks';
import { useCancelActivationMutation } from '@/store/api/k30Api';
import type { ActivationDto } from '@/store/api/types';
import { ActivationLongWaitSeconds, SupportTelegram } from '@/utils/consts';

import classes from './ProgressStep.module.scss';

interface Props {
  activation: ActivationDto;
  onUpdate: (activation: ActivationDto) => void;
}

/** Экран ожидания: поставщик выдаёт подписку.
 *
 *  Активация асинхронная — у Claude она занимает около двух минут, и
 *  бэкенд опрашивается по `poll_after`. Вкладку можно закрыть: ссылка
 *  приведёт обратно к этой же активации. Кнопку отмены показывает
 *  только бэкенд флагом `can_cancel` — умеет это не каждый поставщик.
 */
export const ProgressStep: FC<Props> = ({ activation, onUpdate }) => {
  const { activation: fresh, elapsed } = useActivationPolling(
    activation.id,
    activation,
  );
  const [cancel, { isLoading: isCancelling }] = useCancelActivationMutation();

  useEffect(() => {
    if (fresh && fresh !== activation) onUpdate(fresh);
  }, [fresh, activation, onUpdate]);

  const current = fresh ?? activation;
  const isQueued = current.status === 'pending';
  const isLong = elapsed > ActivationLongWaitSeconds;

  const onCancel = async () => {
    try {
      const response = await cancel(current.id).unwrap();
      onUpdate(response.activation);
    } catch {
      // Отмена не удалась — активация продолжается, её итог придёт
      // очередным опросом.
    }
  };

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
          {/* Статус читается вслух при смене: покупатель может смотреть
              в другое окно, пока идёт активация. */}
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

      {current.can_cancel && (
        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={onCancel}
          loading={isCancelling}
        >
          Отменить, пока не началось
        </Button>
      )}
    </motion.div>
  );
};

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}
