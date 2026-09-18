'use client';

import React, { FC } from 'react';

import { Button, Notice } from '@/components/ui';
import { apiErrorMessage } from '@/store/api/errors';
import { Routes } from '@/utils/consts';

import classes from './InvoiceRetry.module.scss';
import type { PaymentChoice } from '../CheckoutView/useCheckout';
import { PaymentMethods } from '../PaymentMethods/PaymentMethods';
import { StatusScreen } from '../StatusScreen/StatusScreen';

interface Props {
  number: number;
  /** Чем платёжная система объяснила отказ */
  reason: string;
  payment: PaymentChoice;
  isRetrying: boolean;
  error: unknown;
  onRetry: () => void;
}

/** Заказ завели, а счёт не выставился: платим ещё раз, не заводя второй */
export const InvoiceRetry: FC<Props> = ({
  number,
  reason,
  payment,
  isRetrying,
  error,
  onRetry,
}) => (
  <StatusScreen overline="Заказ оформлен" title={`Заказ №${number}`}>
    <Notice tone="error" title="Счёт не выставился">
      {reason ||
        'Платёжная система не ответила. Заказ сохранён — попробуйте оплатить ещё раз.'}
    </Notice>

    <div className={classes.retry}>
      <PaymentMethods
        methods={payment.methods}
        value={payment.method}
        onChange={payment.setMethod}
        isLoading={payment.isLoading}
        notice={payment.notice}
        unavailableText={payment.unavailableText}
      />

      {error != null && (
        <Notice tone="error" title="Снова не вышло">
          {apiErrorMessage(error, 'Попробуйте другой способ оплаты.')}
        </Notice>
      )}

      {payment.canPay && (
        <Button onClick={onRetry} loading={isRetrying} fullWidth size="large">
          Оплатить ещё раз
        </Button>
      )}

      <Button href={Routes.Account} variant="outlined" fullWidth>
        Мои заказы
      </Button>
    </div>
  </StatusScreen>
);
