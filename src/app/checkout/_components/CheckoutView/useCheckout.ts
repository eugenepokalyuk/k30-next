'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import {
  useCheckoutQuery,
  useCreatePaymentMutation,
  usePaymentMethodsQuery,
} from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  cartCleared,
  planChosen,
  selectCartItem,
  selectCartReady,
} from '@/store/slices/cart';

import { useBonus } from '../BonusSwitch/useBonus';
import { usePromo } from '../PromoField/usePromo';

export const useCheckout = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(selectCartItem);
  const isCartReady = useAppSelector(selectCartReady);

  const service = params.get('service') || cartItem?.service || '';
  const plan = params.get('plan') || cartItem?.plan || '';
  const returnedTo = params.get('payment') || '';

  const order = useCheckoutQuery(
    { service, plan },
    { skip: !service || !plan || Boolean(returnedTo) },
  );

  const payment = usePaymentChoice({ skip: Boolean(returnedTo) });

  const promo = usePromo({ service, plan, skip: Boolean(returnedTo) });

  const bonus = useBonus({
    service,
    plan,
    skip: Boolean(returnedTo),
    onUse: promo.clear,
  });

  const { reset: resetBonus } = bonus;

  React.useEffect(() => {
    if (promo.applied) resetBonus();
  }, [promo.applied, resetBonus]);

  const [createPayment, created] = useCreatePaymentMutation();

  React.useEffect(() => {
    if (!isCartReady || !service || !plan) return;
    if (cartItem?.service === service && cartItem?.plan === plan) return;

    dispatch(planChosen({ service, plan }));
  }, [cartItem, isCartReady, plan, service]);

  const pay = async () => {
    try {
      const result = await createPayment({
        service,
        plan,
        method: payment.method,
        promo: promo.applied?.code,
        use_bonus: bonus.isOn,
      }).unwrap();

      if (result.payment?.pay_url) {
        dispatch(cartCleared());
        window.location.href = result.payment.pay_url;
      }
    } catch (error) {
      const refusal = promoRefusal(error);
      if (refusal) promo.reject(refusal);
    }
  };

  return {
    service,
    plan,
    returnedTo,
    order,
    payment,
    promo,
    bonus,
    created,
    payError: promoRefusal(created.error) ? null : created.error,
    pay,
  };
};

const promoRefusal = (error: unknown): string => {
  const data = (error as { data?: { error?: string; error_code?: string } })
    ?.data;

  return data?.error_code === 'promo' ? (data.error ?? '') : '';
};

const usePaymentChoice = ({ skip }: { skip: boolean }) => {
  const { data, isLoading } = usePaymentMethodsQuery(undefined, { skip });
  const methods = React.useMemo(() => data?.methods ?? [], [data]);

  const [method, setMethod] = React.useState('');

  React.useEffect(() => {
    setMethod((current) =>
      methods.some((item) => item.id === current)
        ? current
        : (methods[0]?.id ?? ''),
    );
  }, [methods]);

  return {
    methods,
    method,
    setMethod,
    isLoading,
    notice: data?.notice,
    unavailableText: data?.unavailable_text,
    canPay: !isLoading && methods.length > 0 && Boolean(method),
  };
};

export type PaymentChoice = ReturnType<typeof usePaymentChoice>;
