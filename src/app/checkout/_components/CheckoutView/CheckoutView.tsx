'use client';

import React, { FC } from 'react';

import { Button, Notice, Section } from '@/components/ui';
import { useMyOrderQuery } from '@/store/api/k30Api';
import { Routes } from '@/utils/consts';

import classes from './CheckoutView.module.scss';
import { useCheckout } from './useCheckout';
import { CheckoutTerms } from '../CheckoutTerms/CheckoutTerms';
import { InvoiceRetry } from '../InvoiceRetry/InvoiceRetry';
import { OrderResult } from '../OrderResult/OrderResult';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { StatusScreen } from '../StatusScreen/StatusScreen';

export const CheckoutView: FC = () => {
  const { service, plan, returnedTo, order, payment, created, retried, pay, retry } =
    useCheckout();

  if (returnedTo) return <ReturnedOrder number={returnedTo} />;

  if (created.data && !created.data.payment) {
    return (
      <InvoiceRetry
        number={created.data.order.number}
        reason={created.data.error}
        payment={payment}
        isRetrying={retried.isLoading}
        error={retried.error}
        onRetry={() => retry(created.data!.order.number)}
      />
    );
  }

  if (created.data) return <OrderResult order={created.data.order} />;

  if (!service || !plan) {
    return (
      <StatusScreen
        overline="Оформление заказа"
        title="Корзина пуста"
        text="Выберите сервис и тариф — они появятся здесь."
        actions={<Button href={Routes.Buy}>Выбрать подписку</Button>}
      />
    );
  }

  if (order.isLoading) {
    return <Section overline="Оформление заказа" title="Загружаем заказ…" />;
  }

  if (order.isError || !order.data) {
    return (
      <StatusScreen
        overline="Оформление заказа"
        title="Тариф не найден"
        actions={
          <Button href={Routes.Buy} variant="outlined">
            Вернуться к сервисам
          </Button>
        }
      >
        <Notice tone="error" title="Этот тариф больше не продаётся">
          Возможно, его сняли с витрины. Выберите другой.
        </Notice>
      </StatusScreen>
    );
  }

  return (
    <Section overline="Покупка" title="Оформление заказа">
      <div className={classes.layout}>
        <OrderSummary
          data={order.data}
          payment={payment}
          isSending={created.isLoading}
          error={created.error}
          onPay={pay}
        />

        <CheckoutTerms blocks={order.data.blocks} />
      </div>
    </Section>
  );
};

/**
 *  Заказ, открытый по ссылке возврата с оплаты.
 *
 *  Корзины в этот момент уже нет — она очищается при оформлении, — поэтому
 *  заказ читается заново по номеру из адреса
 */
const ReturnedOrder: FC<{ number: number }> = ({ number }) => {
  const { data, isLoading, isError } = useMyOrderQuery(number);

  if (isLoading) {
    return <Section overline="Оформление заказа" title="Проверяем оплату…" />;
  }

  if (isError || !data) {
    return (
      <StatusScreen
        overline="Оформление заказа"
        title="Заказ не найден"
        actions={<Button href={Routes.Account}>Мои заказы</Button>}
      >
        <Notice tone="error" title="Такого заказа нет">
          Возможно, он оформлен на другой кабинет. Загляните в «Мои заказы».
        </Notice>
      </StatusScreen>
    );
  }

  return <OrderResult order={data} />;
};
