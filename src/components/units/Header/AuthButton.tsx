'use client';

import React, { FC } from 'react';

import { Button, UserIcon } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthorized, selectIsAuthReady } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './Header.module.scss';

interface Props {
  onNavigate: () => void;
}

/** Кнопка «Войти» или «Кабинет».
 *
 *  Пока вход не восстановлен из localStorage, не рисуем ничего: иначе на
 *  долю секунды показывается «Войти» уже вошедшему, и это выглядит как
 *  разлогинивание.
 */
export const AuthButton: FC<Props> = ({ onNavigate }) => {
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isReady = useAppSelector(selectIsAuthReady);

  if (!isReady) return null;

  return (
    <Button
      href={isAuthorized ? Routes.Account : Routes.Login}
      size="small"
      variant="outlined"
      onClick={onNavigate}
      className={classes.button}
    >
      {isAuthorized && <UserIcon size={16} />}
      {isAuthorized ? 'Кабинет' : 'Войти'}
    </Button>
  );
};
