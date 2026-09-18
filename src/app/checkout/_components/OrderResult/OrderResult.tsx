'use client';

import React, { FC } from 'react';

import { Button, KeyCode } from '@/components/ui';
import { useMyOrderQuery } from '@/store/api/k30Api';
import type { OrderDto } from '@/store/api/types';
import { activateRoute, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import classes from './OrderResult.module.scss';
import { StatusScreen } from '../StatusScreen/StatusScreen';

const POLL_MS = 3000;

interface Props {
  order: OrderDto;
}

/**
 *  Что стало с заказом. Состояние различает сам заказ, а не наши догадки.
 *
 *  Ключ приезжает, когда подтвердится оплата, поэтому заказ перечитывается
 *  до тех пор. Бэкенд на каждое такое чтение сам спрашивает платёжную
 *  систему — отдельного опроса платежа витрине не нужно
 */
export const OrderResult: FC<Props> = ({ order: created }) => {
  const { data } = useMyOrderQuery(created.number, {
    skip: Boolean(created.key_code),
    pollingInterval: POLL_MS,
  });

  const order = data ?? created;
  const price = formatPrice(order.price);
  const summary = `${order.service} ${order.plan}${price ? ` — ${price}` : ''}`;

  if (order.key_code) {
    return (
      <StatusScreen
        overline="Оплачено"
        title="Ключ активации"
        mark
        text={`${summary}. Ключ ваш — сохраните код, он понадобится при активации и останется в кабинете.`}
        actions={
          <>
            <Button href={activateRoute(order.key_code)} size="large">
              Активировать подписку
            </Button>
            <Button href={Routes.Account} variant="outlined">
              Мои заказы
            </Button>
          </>
        }
      >
        <KeyCode code={order.key_code} className={classes.key} />
      </StatusScreen>
    );
  }

  if (order.awaits_key) {
    return (
      <StatusScreen
        overline="Оплачено"
        title={`Заказ №${order.number}`}
        mark
        text={`${summary}. Оплата прошла. Ключей этого тарифа на складе сейчас нет — пополняем. Код появится здесь и в кабинете, как только ключ будет готов.`}
        actions={<Button href={Routes.Account}>Мои заказы</Button>}
      />
    );
  }

  if (order.payment?.pay_url) {
    return (
      <StatusScreen
        overline="Ждём оплату"
        title={`Заказ №${order.number}`}
        text={`${summary}. Счёт выставлен. Если вы уже заплатили — подождите несколько секунд, страница обновится сама и покажет ключ.`}
        actions={
          <>
            <Button href={order.payment.pay_url} external size="large">
              Вернуться к оплате
            </Button>
            <Button href={Routes.Account} variant="outlined">
              Мои заказы
            </Button>
          </>
        }
      />
    );
  }

  return (
    <StatusScreen
      overline="Заказ оформлен"
      title={`Заказ №${order.number}`}
      mark
      text={`${summary}. Заказ у нас и ждёт оплаты. Как только она пройдёт, ключ активации появится прямо на этой странице.`}
      actions={
        <>
          <Button href={Routes.Account}>Мои заказы</Button>
          <Button href={Routes.Buy} variant="outlined">
            Купить ещё
          </Button>
        </>
      }
    />
  );
};
