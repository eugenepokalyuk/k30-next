'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease, Reveal } from '@/components/motion';
import { Notice, ServiceMark } from '@/components/ui';
import { apiErrorMessage } from '@/store/api/errors';
import type { CheckoutDto } from '@/store/api/types';
import { formatPrice } from '@/utils/helpers';

import classes from './OrderSummary.module.scss';
import { CheckoutAction } from './CheckoutAction';
import { BonusSwitch } from '../BonusSwitch/BonusSwitch';
import type { Bonus } from '../BonusSwitch/useBonus';
import type { PaymentChoice } from '../CheckoutView/useCheckout';
import { PaymentMethods } from '../PaymentMethods/PaymentMethods';
import { PromoField } from '../PromoField/PromoField';
import type { Promo } from '../PromoField/usePromo';

interface Props {
  data: CheckoutDto;
  payment: PaymentChoice;
  promo: Promo;
  bonus: Bonus;
  isSending: boolean;
  error: unknown;
  onPay: () => void;
}

export const OrderSummary: FC<Props> = ({
  data,
  payment,
  promo,
  bonus,
  isSending,
  error,
  onPay,
}) => {
  const applied = promo.applied;
  const spent = bonus.isOn && !applied ? Number(bonus.available) : 0;
  const afterPromo = Number(applied ? applied.total : (data.total ?? 0));
  const total =
    data.total === null ? null : formatPrice((afterPromo - spent).toFixed(2));

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

      <PromoField promo={promo} />

      <BonusSwitch bonus={bonus} />

      <AnimatePresence initial={false}>
        {(applied || spent > 0) && (
          <motion.div
            className={classes.lines}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.fast, ease }}
          >
            <div className={classes.lines_inner}>
              <p className={classes.line}>
                <span className={classes.line_label}>Стоимость</span>
                <span className={classes.line_value}>
                  {formatPrice(data.total)}
                </span>
              </p>

              {applied && (
                <p className={classes.line}>
                  <span className={classes.line_label}>
                    Скидка по промокоду {applied.code}
                  </span>
                  <span className={clsx(classes.line_value, classes.discount)}>
                    −{formatPrice(applied.discount)}
                  </span>
                </p>
              )}

              {spent > 0 && (
                <p className={classes.line}>
                  <span className={classes.line_label}>Списано бонусов</span>
                  <span className={clsx(classes.line_value, classes.discount)}>
                    −{formatPrice(bonus.available)}
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={classes.total}>
        <span className={classes.total_label}>К оплате</span>

        <motion.span
          key={total ?? 'none'}
          className={classes.total_value}
          initial={{ opacity: 0.35, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease }}
        >
          {total ?? 'по запросу'}
        </motion.span>
      </div>

      {!data.plan.in_stock && (
        <Notice tone="info" title="Тарифа нет в наличии">
          Заказ примем, но ключ придётся подождать — он появится здесь и в
          профиле, как только поступит на склад
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
          {apiErrorMessage(error, 'Попробуйте ещё раз или напишите в поддержку')}
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
