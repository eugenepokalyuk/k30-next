'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { Notice, ServiceMark } from '@/components/ui';
import { apiErrorMessage } from '@/store/api/errors';
import type { CheckoutDto } from '@/store/api/types';
import { formatPrice } from '@/utils/helpers';

import classes from './OrderSummary.module.scss';
import { CheckoutAction } from './CheckoutAction';
import type { PaymentChoice } from '../CheckoutView/useCheckout';
import { PaymentMethods } from '../PaymentMethods/PaymentMethods';

interface Props {
  data: CheckoutDto;
  payment: PaymentChoice;
  isSending: boolean;
  error: unknown;
  onPay: () => void;
}

export const OrderSummary: FC<Props> = ({
  data,
  payment,
  isSending,
  error,
  onPay,
}) => {
  const total = formatPrice(data.total);

  return (
    <Reveal className={classes.summary}>
      <div className={classes.row}>
        <ServiceMark
          logo={data.service.logo}
          accentColor={data.service.accent_color}
          size={40}
        />
        <div className={classes.row_text}>
          <p className={classes.row_label}>Сервис</p>
          <p className={classes.row_value}>{data.service.name}</p>
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.row_text}>
          <p className={classes.row_label}>Тариф</p>
          <p className={classes.row_value}>
            {data.plan.name}
            {data.plan.duration_days ? ` · ${data.plan.duration_days} дн.` : ''}
          </p>
        </div>
      </div>

      <div className={classes.total}>
        <span className={classes.total_label}>К оплате</span>
        <span className={classes.total_value}>{total ?? 'по запросу'}</span>
      </div>

      {!data.plan.in_stock && (
        <Notice tone="info" title="Тарифа нет в наличии">
          Заказ примем, но ключ придётся подождать — он появится здесь и в
          кабинете, как только поступит на склад.
        </Notice>
      )}

      <PaymentMethods
        methods={payment.methods}
        value={payment.method}
        onChange={payment.setMethod}
        isLoading={payment.isLoading}
        notice={payment.notice}
        unavailableText={payment.unavailableText}
      />

      {error != null && (
        <Notice tone="error" title="Заказ не оформился">
          {apiErrorMessage(error, 'Попробуйте ещё раз или напишите в поддержку.')}
        </Notice>
      )}

      <CheckoutAction
        canPay={payment.canPay && total !== null}
        total={total}
        isSending={isSending}
        onPay={onPay}
      />
    </Reveal>
  );
};
