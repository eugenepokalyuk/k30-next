'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { Stagger, StaggerItem } from '@/components/motion';
import { useMySubscriptionsQuery } from '@/store/api/k30Api';
import type { SubscriptionDto } from '@/store/api/types';
import { formatDate } from '@/utils/helpers';

import classes from './SubscriptionsList.module.scss';

/** За сколько дней до конца срок считается «на исходе». */
const SOON_DAYS = 7;

/** Активные подписки: срок и остаток считает бэкенд (`days_left`).
 *
 *  Пустого состояния нет — без активных подписок блок не показывается,
 *  а нового покупателя встречает пустой список заказов. */
export const SubscriptionsList: FC = () => {
  const { data } = useMySubscriptionsQuery();
  if (!data?.length) return null;

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>Активные подписки</h2>

      <Stagger as="ul" className={classes.list}>
        {data.map((item) => (
          <StaggerItem
            as="li"
            key={item.number}
            className={classes.item}
            style={
              item.accent_color
                ? ({ '--accent': item.accent_color } as React.CSSProperties)
                : undefined
            }
          >
            <div className={classes.head}>
              <p className={classes.service}>
                <span className={classes.dot} aria-hidden />
                {item.service}
              </p>
              <span className={clsx(classes.left, soon(item) && classes.soon)}>
                {daysLabel(item.days_left)}
              </span>
            </div>

            <p className={classes.plan}>{item.plan}</p>

            <span
              className={classes.track}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={item.duration_days}
              aria-valuenow={spent(item)}
              aria-label={`Осталось дней: ${item.days_left ?? 0}`}
            >
              <span
                className={clsx(classes.bar, soon(item) && classes.bar_soon)}
                style={{ width: `${percent(item)}%` }}
              />
            </span>

            <p className={classes.meta}>
              {item.expires_at ? `до ${formatDate(item.expires_at)}` : 'бессрочно'}
            </p>

            {item.account_email && (
              <p className={classes.account} title={item.account_email}>
                {item.account_email}
              </p>
            )}
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};

const soon = (item: SubscriptionDto) =>
  item.days_left !== null && item.days_left <= SOON_DAYS;

const spent = (item: SubscriptionDto) =>
  Math.max(0, item.duration_days - (item.days_left ?? 0));

/** Доля прожитого срока. Минимум процент: в первый день подписки пустая
 *  полоса выглядит как «не работает». */
function percent(item: SubscriptionDto): number {
  if (!item.duration_days) return 0;
  return Math.min(100, Math.max(1, (spent(item) / item.duration_days) * 100));
}

function daysLabel(days: number | null): string {
  if (days === null) return 'без срока';
  if (days === 0) return 'последний день';

  const tail = days % 10;
  const teen = days % 100 >= 11 && days % 100 <= 14;
  if (!teen && tail === 1) return `${days} день`;
  if (!teen && tail >= 2 && tail <= 4) return `${days} дня`;
  return `${days} дней`;
}
