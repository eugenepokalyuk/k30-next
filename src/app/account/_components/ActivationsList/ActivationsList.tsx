'use client';

import React, { FC } from 'react';

import { Button, KeyCode, Notice } from '@/components/ui';
import { useMyActivationsQuery } from '@/store/api/k30Api';
import type { ActivationDto } from '@/store/api/types';
import { activateRoute } from '@/utils/consts';
import { formatDateTime } from '@/utils/helpers';

import classes from './ActivationsList.module.scss';

/** История попыток активации — отвечает на «почему не заработало».
 *
 *  Показываем, только когда попытки были. */
export const ActivationsList: FC = () => {
  const { data, isLoading, isError } = useMyActivationsQuery();

  if (isLoading || isError || !data?.length) return null;

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>История активаций</h2>

      <ul className={classes.list}>
        {data.map((activation) => (
          <li key={activation.id} className={classes.item}>
            <div className={classes.top}>
              <span className={classes.service}>
                {[activation.key.service, activation.key.plan]
                  .filter(Boolean)
                  .join(' ')}
              </span>
              <span className={badgeClass(activation)}>
                {activation.status_label}
              </span>
            </div>

            <p className={classes.meta}>
              <span className={classes.nowrap}>
                {formatDateTime(activation.created_at)}
              </span>
              {activation.account_email && (
                <>
                  <span className={classes.separator} aria-hidden>
                    ·
                  </span>
                  {activation.account_email}
                </>
              )}
            </p>

            <KeyCode code={activation.key.code} className={classes.code} />

            {activation.error && (
              <Notice
                tone={activation.blame === 'customer' ? 'info' : 'error'}
                className={classes.error}
              >
                {activation.error}
              </Notice>
            )}

            <div className={classes.actions}>
              {isRunning(activation) && (
                <Button
                  href={activateRoute(activation.key.code)}
                  size="small"
                  variant="outlined"
                >
                  Открыть активацию
                </Button>
              )}

              {/* Повтор предлагает бэкенд: у части поставщиков карта
                  после неудачи заморожена, и вторая попытка опасна. */}
              {activation.can_retry && (
                <Button
                  href={activateRoute(activation.key.code)}
                  size="small"
                  variant="outlined"
                >
                  Повторить активацию
                </Button>
              )}

              {activation.activation_url && (
                <Button
                  href={activation.activation_url}
                  external
                  size="small"
                  variant="ghost"
                >
                  Ссылка активации
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

function isRunning(activation: ActivationDto): boolean {
  return activation.status === 'pending' || activation.status === 'processing';
}

function badgeClass(activation: ActivationDto): string {
  if (activation.status === 'success') return classes.badge_done;
  if (activation.status === 'failed') return classes.badge_failed;
  return classes.badge;
}
