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

/** Вся логика страницы оформления: что покупаем, чем платим и куда уходим */
export const useCheckout = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(selectCartItem);

  // Адрес главнее корзины: по присланной ссылке должен открыться тот
  // тариф, а не последний отложенный
  const service = params.get('service') || cartItem?.service || '';
  const plan = params.get('plan') || cartItem?.plan || '';
  // Сюда возвращает платёжная система — и когда заплатили, и когда нет
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

  /**
   *  Заводим счёт и уводим на оплату.
   *
   *  Редирект, а не новая вкладка: на телефоне вторая теряется, а
   *  приложение банка возвращает человека в ту, из которой ушли.
   *  Корзину чистим только здесь — до оплаты покупателю нечего терять,
   *  а вернувшись, он должен увидеть тот же тариф
   */
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
      // Текст отказа показывает `created.error`
    }
  };

  return { service, plan, returnedTo, order, payment, created, pay };
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
