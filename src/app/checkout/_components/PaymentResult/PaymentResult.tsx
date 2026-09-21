'use client';

import React, { FC } from 'react';

import { Button, KeyCode, Notice } from '@/components/ui';
import { usePaymentStatusQuery } from '@/store/api/k30Api';
import { activateRoute, checkoutRoute, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import classes from './PaymentResult.module.scss';
import { StatusScreen } from '../StatusScreen/StatusScreen';

const POLL_MS = 3000;

interface Props {
  id: string;
}

export const PaymentResult: FC<Props> = ({ id }) => {
  const { data, isLoading, isError } = usePaymentStatusQuery(id, {
    pollingInterval: POLL_MS,
    skipPollingIfUnfocused: false,
  });

  const payment = data?.payment;

  if (isLoading) {
    return <StatusScreen overline="Оплата" title="Проверяем оплату…" />;
  }

  if (isError || !payment) {
    return (
      <StatusScreen
        overline="Оплата"
        title="Счёт не найден"
        actions={<Button href={Routes.Buy}>Выбрать подписку</Button>}
      >
        <Notice tone="error" title="Такого счёта нет">
          Возможно, он выставлен на другой кабинет. Загляните в «Мои заказы».
        </Notice>
      </StatusScreen>
    );
  }

  const price = formatPrice(payment.amount);
  const summary = `${payment.service} ${payment.plan}${price ? ` — ${price}` : ''}`;

  if (payment.key_code) {
    return (
      <StatusScreen
        overline="Ключ активации"
        title="Оплата прошла"
        text={summary}
        actions={
          <>
            <Button href={activateRoute(payment.key_code)} size="large">
              Активировать подписку
            </Button>
            <Button href={Routes.Account} variant="outlined">
              Мои заказы
            </Button>
          </>
        }
      >
        <div className={classes.ready}>
          <KeyCode code={payment.key_code} className={classes.key} />
          <span className={classes.status}>Ключ готов</span>
        </div>

        <p className={classes.hint}>
          Сохраните код — он понадобится при активации и останется в кабинете.
        </p>
      </StatusScreen>
    );
  }

  if (payment.awaits_key) {
    return (
      <StatusScreen
        overline="Оплачено"
        title={`Заказ №${payment.order_number}`}
        mark
        text={`${summary}. Оплата прошла. Ключей этого тарифа на складе сейчас нет — пополняем. Код появится здесь и в кабинете, как только ключ будет готов.`}
        actions={<Button href={Routes.Account}>Мои заказы</Button>}
      />
    );
  }

  const isClosed = payment.status !== 'pending';

  return (
    <StatusScreen
      overline="Оплата"
      title="Оплата не завершена"
      text={`${summary}. Деньги не поступили, и заказ мы не оформляли. Если вы передумали — ничего делать не нужно.`}
      actions={
        <>
          {isClosed ? (
            <Button
              href={checkoutRoute(payment.service_slug, payment.plan_slug)}
              size="large"
            >
              Оплатить ещё раз
            </Button>
          ) : (
            <Button href={payment.pay_url} external size="large">
              Вернуться к оплате
            </Button>
          )}
          <Button href={Routes.Buy} variant="outlined">
            Выбрать другой тариф
          </Button>
        </>
      }
    >
      {payment.status === 'pending' && (
        <p className={classes.hint}>
          Уже заплатили? Подождите несколько секунд — страница обновится сама.
        </p>
      )}
    </StatusScreen>
  );
};
