'use client';

import React, { FC } from 'react';

import { Stagger, StaggerItem } from '@/components/motion';
import { CardIcon, Notice } from '@/components/ui';
import { useMyPromosQuery } from '@/store/api/k30Api';
import { formatDate, formatPrice } from '@/utils/helpers';

import classes from './PromosList.module.scss';

export const PromosList: FC = () => {
  const { data, isLoading, isError } = useMyPromosQuery();

  if (isLoading) {
    return <p className={classes.loading}>{'Загружаем промокоды'}</p>;
  }

  if (isError) {
    return (
      <Notice tone="error" title="Не получилось загрузить промокоды">
        {'Обновите страницу или напишите в поддержку'}
      </Notice>
    );
  }

  if (!data?.length) {
    return (
      <div className={classes.empty}>
        <span className={classes.empty_icon}>
          <CardIcon size={24} />
        </span>
        <p className={classes.empty_title}>{'Промокодов пока не было'}</p>

        <p className={classes.empty_text}>
          {
            'Промокод вводится при оформлении заказа. Каждый код действует один раз — использованные останутся здесь.'
          }
        </p>
      </div>
    );
  }

  return (
    <Stagger as="ul" className={classes.list}>
      {data.map((use) => (
        <StaggerItem
          as="li"
          key={`${use.code}-${use.used_at}`}
          className={classes.item}
        >
          <span className={classes.code}>{use.code}</span>

          <span className={classes.text}>
            <span className={classes.amount}>
              Скидка {formatPrice(use.amount)}
            </span>

            <span className={classes.meta}>
              {[
                [use.service, use.plan].filter(Boolean).join(' '),
                use.order_number ? `заказ №${use.order_number}` : '',
                formatDate(use.used_at),
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
};
