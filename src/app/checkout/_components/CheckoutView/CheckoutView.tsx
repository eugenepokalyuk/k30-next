'use client';

import React, { FC } from 'react';

import { Button, Notice, Section } from '@/components/ui';
import { Routes } from '@/utils/consts';

import classes from './CheckoutView.module.scss';
import { useCheckout } from './useCheckout';
import { CheckoutTerms } from '../CheckoutTerms/CheckoutTerms';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { PaymentResult } from '../PaymentResult/PaymentResult';
import { StatusScreen } from '../StatusScreen/StatusScreen';

export const CheckoutView: FC = () => {
  const { service, plan, returnedTo, order, payment, created, pay } =
    useCheckout();

  if (returnedTo) return <PaymentResult id={returnedTo} />;

  if (!service || !plan) {
    return (
      <StatusScreen
        overline="Оформление заказа"
        title="Корзина пуста"
        text="Выберите сервис и тариф — они появятся здесь"
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
