'use client';

import React, { FC } from 'react';

import { Button, KeyCode, Notice } from '@/components/ui';
import { useMyActivationsQuery } from '@/store/api/k30Api';
import type { ActivationDto } from '@/store/api/types';
import { activateRoute } from '@/utils/consts';
import { formatDateTime } from '@/utils/helpers';

import classes from './ActivationsList.module.scss';

/** История попыток активации.
 *
 *  Отдельно от заказов, потому что это разные вопросы. Заказ отвечает
 *  «что я купил», активация — «почему оно не заработало». Второй вопрос
 *  и приводит человека в поддержку; с историей на экране часть таких
 *  обращений заканчивается сама — видно, что попытка не прошла из-за
 *  перепутанного аккаунта, и её можно повторить прямо отсюда.
 *
 *  Показываем только когда попытки были. Пустой раздел «История» в
 *  кабинете у того, кто ничего не активировал, — это шум.
 */
export const ActivationsList: FC = () => {
  const { data, isLoading, isError } = useMyActivationsQuery();

  if (isLoading || isError || !data?.length) return null;

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>История активаций</h2>

      {/* Идущие активации показываем первыми и со ссылкой обратно:
          вкладку часто закрывают, не дождавшись, и вернуться к ней
          иначе неоткуда. */}
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

            {/* Дата и аккаунт — одной строкой мелким, как в заказах:
                это подписи к попытке, а не её содержание. Содержание —
                статус наверху и причина отказа ниже. */}
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

              {/* Повтор предлагаем, только если бэкенд его разрешил:
                  у части поставщиков карта после неудачи заморожена,
                  и вторая попытка либо бесполезна, либо опасна. */}
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
