'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import {
  useCheckoutQuery,
  useCreatePaymentMutation,
  usePaymentMethodsQuery,
} from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cartCleared, planChosen, selectCartItem } from '@/store/slices/cart';

export const useCheckout = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(selectCartItem);

  const service = params.get('service') || cartItem?.service || '';
  const plan = params.get('plan') || cartItem?.plan || '';
  const returnedTo = params.get('payment') || '';

  const order = useCheckoutQuery(
    { service, plan },
    { skip: !service || !plan || Boolean(returnedTo) },
  );

  const payment = usePaymentChoice({ skip: Boolean(returnedTo) });

  const [createPayment, created] = useCreatePaymentMutation();

  React.useEffect(() => {
    if (!service || !plan) return;
    if (cartItem?.service === service && cartItem?.plan === plan) return;

    dispatch(planChosen({ service, plan }));
  }, [cartItem, dispatch, plan, service]);

  const pay = async () => {
    try {
      const result = await createPayment({
        service,
        plan,
        method: payment.method,
      }).unwrap();

      if (result.payment?.pay_url) {
        dispatch(cartCleared());
        window.location.href = result.payment.pay_url;
      }
    } catch {
    }
  };

  return { service, plan, returnedTo, order, payment, created, pay };
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
