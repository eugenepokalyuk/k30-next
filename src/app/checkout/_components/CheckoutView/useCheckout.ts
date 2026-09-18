'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import {
  useCheckoutQuery,
  useCreateOrderMutation,
  usePaymentMethodsQuery,
  usePayOrderMutation,
} from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cartCleared, planChosen, selectCartItem } from '@/store/slices/cart';

/** Вся логика страницы оформления: что покупаем, чем платим и куда уходим */
export const useCheckout = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(selectCartItem);

  // Адрес главнее корзины: по присланной ссылке должен открыться тот
  // заказ, а не последний отложенный
  const service = params.get('service') || cartItem?.service || '';
  const plan = params.get('plan') || cartItem?.plan || '';
  const returnedTo = Number(params.get('order')) || 0;

  const order = useCheckoutQuery(
    { service, plan },
    { skip: !service || !plan || Boolean(returnedTo) },
  );

  const payment = usePaymentChoice({ skip: Boolean(returnedTo) });

  const [createOrder, created] = useCreateOrderMutation();
  const [payOrder, retried] = usePayOrderMutation();

  React.useEffect(() => {
    if (created.data || !service || !plan) return;
    if (cartItem?.service === service && cartItem?.plan === plan) return;

    dispatch(planChosen({ service, plan }));
  }, [cartItem, created.data, dispatch, plan, service]);

  React.useEffect(() => {
    if (created.data) dispatch(cartCleared());
  }, [dispatch, created.data]);

  // Редирект, а не новая вкладка: на телефоне вторая теряется, а
  // приложение банка возвращает человека в ту, из которой ушли
  const goToPayment = (url?: string) => {
    if (url) window.location.href = url;
  };

  const pay = async () => {
    try {
      const result = await createOrder({
        service,
        plan,
        method: payment.method,
      }).unwrap();
      goToPayment(result.payment?.pay_url);
    } catch {
      // Текст отказа показывает `created.error`
    }
  };

  const retry = async (number: number) => {
    try {
      const result = await payOrder({ number, method: payment.method }).unwrap();
      goToPayment(result.payment?.pay_url);
    } catch {
      // Текст отказа показывает `retried.error`
    }
  };

  return {
    service,
    plan,
    returnedTo,
    order,
    payment,
    created,
    retried,
    pay,
    retry,
  };
};

/** Способы оплаты и выбранный: пустой список означает, что платить нечем */
const usePaymentChoice = ({ skip }: { skip: boolean }) => {
  const { data, isLoading } = usePaymentMethodsQuery(undefined, { skip });
  const methods = React.useMemo(() => data?.methods ?? [], [data]);

  const [method, setMethod] = React.useState('');

  // Первым админка ставит тот способ, которым платят чаще, — выбираем его
  // заранее. Выбор человека не трогаем
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
    // Пока список грузится, кнопки тоже нет: показать её и выключить
    // через полсекунды хуже, чем показать на полсекунды позже
    canPay: !isLoading && methods.length > 0 && Boolean(method),
  };
};

export type PaymentChoice = ReturnType<typeof usePaymentChoice>;
