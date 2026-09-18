'use client';

import React, { FC } from 'react';

import { Button } from '@/components/ui';
import { TelegramEmailForm } from '@/components/units';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthorized, selectIsAuthReady } from '@/store/slices/auth';
import { selectIsMiniApp, selectWebAppAuth } from '@/store/slices/telegram';
import { Routes } from '@/utils/consts';

import classes from './OrderSummary.module.scss';

interface Props {
  /** Платить нечем — не показываем ничего: ни оплаты, ни входа */
  canPay: boolean;
  total: string | null;
  isSending: boolean;
  onPay: () => void;
}

/** Чем заканчивается карточка заказа: оплатой, входом или вопросом о почте */
export const CheckoutAction: FC<Props> = ({
  canPay,
  total,
  isSending,
  onPay,
}) => {
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isAuthReady = useAppSelector(selectIsAuthReady);
  const isMiniApp = useAppSelector(selectIsMiniApp);
  const webAppAuth = useAppSelector(selectWebAppAuth);

  if (isAuthReady && !isAuthorized && isMiniApp && webAppAuth === 'needs_email') {
    // В Telegram уводить на экран входа некуда: покупателя мы узнали, не
    // хватает только почты
    return (
      <TelegramEmailForm description="Укажите почту — на неё придут ключ и чек. Это разовый вопрос." />
    );
  }

  if (!canPay) return null;

  if (isAuthReady && !isAuthorized) {
    return (
      <>
        <Button
          href={`${Routes.Login}?next=${encodeURIComponent(Routes.Checkout)}`}
          fullWidth
          size="large"
        >
          Войти и оплатить
        </Button>
        <p className={classes.note}>
          Заказ привязывается к кабинету — там будут ключ и статус.
        </p>
      </>
    );
  }

  return (
    <Button
      onClick={onPay}
      loading={isSending}
      disabled={!isAuthReady}
      fullWidth
      size="large"
    >
      {total ? `Оплатить ${total}` : 'Оплатить'}
    </Button>
  );
};
