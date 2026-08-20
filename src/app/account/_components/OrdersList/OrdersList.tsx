'use client';

import React, { FC } from 'react';

import { Stagger, StaggerItem } from '@/components/motion';
import { Button, KeyIcon, Notice } from '@/components/ui';
import { useMyOrdersQuery } from '@/store/api/k30Api';
import type { OrderDto } from '@/store/api/types';
import { Routes } from '@/utils/consts';
import { formatDateTime } from '@/utils/helpers';

import classes from './OrdersList.module.scss';

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
      {data.map((order) => (
        <StaggerItem as="li" key={order.number} className={classes.item}>
          <div className={classes.top}>
            <span className={classes.service}>
              {[order.service, order.plan].filter(Boolean).join(' ')}
            </span>
            <span
              className={
                order.activation_status === 'activated'
                  ? classes.badge_done
                  : classes.badge
              }
            >
              {activationLabel(order)}
            </span>
          </div>

          <dl className={classes.details}>
            <div className={classes.row}>
              <dt>Заказ</dt>
              <dd>№{order.number}</dd>
            </div>
            <div className={classes.row}>
              <dt>Ключ</dt>
              <dd className={classes.code}>{order.key_code || '—'}</dd>
            </div>
            {order.account_email && (
              <div className={classes.row}>
                <dt>Аккаунт</dt>
                <dd>{order.account_email}</dd>
              </div>
            )}
            <div className={classes.row}>
              <dt>Создан</dt>
              <dd>{formatDateTime(order.created_at)}</dd>
            </div>
          </dl>

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
      ))}
    </Stagger>
  );
};
