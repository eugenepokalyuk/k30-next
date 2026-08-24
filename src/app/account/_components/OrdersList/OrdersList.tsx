'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { Stagger, StaggerItem } from '@/components/motion';
import { Button, KeyCode, KeyIcon, Notice } from '@/components/ui';
import { useMyOrdersQuery } from '@/store/api/k30Api';
import type { OrderDto } from '@/store/api/types';
import { Routes } from '@/utils/consts';
import { formatDate } from '@/utils/helpers';

import classes from './OrdersList.module.scss';

/** Коды источника с бэкенда — в понятные покупателю названия. */
const SOURCES: Record<string, string> = {
  site: 'Активация на сайте',
  telegram: 'Telegram',
  yandex_market: 'Яндекс Маркет',
  manual: 'Заведён вручную',
};

/** Статус активации важнее статуса заказа: покупателя интересует
 *  «работает ли подписка», а не наш внутренний учёт. */
const activationLabel = (order: OrderDto) => {
  if (order.activation_status === 'activated') return 'Активирован';
  if (order.activation_status === 'pending') return 'Ожидает активации';
  return order.status_label;
};

export const OrdersList: FC = () => {
  const { data, isLoading, isError } = useMyOrdersQuery();

  if (isLoading) {
    return <p className={classes.loading}>Загружаем заказы</p>;
  }

  if (isError) {
    return (
      <Notice tone="error" title="Не получилось загрузить заказы">
        Обновите страницу или напишите в поддержку.
      </Notice>
    );
  }

  if (!data?.length) {
    return (
      <div className={classes.empty}>
        <span className={classes.empty_icon}>
          <KeyIcon size={24} />
        </span>
        <p className={classes.empty_title}>Заказов пока нет</p>
        <p className={classes.empty_text}>
          Здесь появятся покупки, которые вы активировали, войдя в кабинет.
          Заказы с Яндекс Маркета и из телеграма добавляет менеджер.
        </p>
        <Button href={Routes.Home} size="small" variant="outlined">
          Активировать ключ
        </Button>
      </div>
    );
  }

  return (
    <Stagger as="ul" className={classes.list}>
      {data.map((order) => {
        const isActivated = order.activation_status === 'activated';

        return (
          <StaggerItem as="li" key={order.number} className={classes.item}>
            <div className={classes.top}>
              <span className={classes.service}>
                {[order.service, order.plan].filter(Boolean).join(' ')}
              </span>
              <span
                className={clsx(classes.badge, isActivated && classes.done)}
              >
                {activationLabel(order)}
              </span>
            </div>

            <p className={classes.meta}>
              <span className={classes.nowrap}>№{order.number}</span>
              <Dot />
              <span className={classes.nowrap}>
                {formatDate(order.created_at)}
              </span>
              {SOURCES[order.source] && (
                <>
                  <Dot />
                  <span className={classes.nowrap}>
                    {SOURCES[order.source]}
                  </span>
                </>
              )}
            </p>

            {order.key_code && (
              <KeyCode code={order.key_code} className={classes.code} />
            )}

            {order.account_email && (
              <p className={classes.account}>
                Подписка на {order.account_email}
              </p>
            )}

            {order.activation_url && (
              <Button
                href={order.activation_url}
                external
                size="small"
                variant="outlined"
              >
                Ссылка активации
              </Button>
            )}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
};

const Dot: FC = () => (
  <span className={classes.separator} aria-hidden>
    ·
  </span>
);
