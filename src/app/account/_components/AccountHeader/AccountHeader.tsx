'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

import { Button, KeyIcon, UserIcon } from '@/components/ui';
import { useAppDispatch } from '@/store/hooks';
import type { UserDto } from '@/store/api/types';
import { authStorage, signedOut } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';
import { formatDate } from '@/utils/helpers';

import classes from './AccountHeader.module.scss';

interface Props {
  user: UserDto;
  /** Сколько подписок работает прямо сейчас — подпись под почтой. */
  active: number;
}

/** Шапка кабинета: кто вошёл и что отсюда можно сделать. */
export const AccountHeader: FC<Props> = ({ user, active }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const signOut = () => {
    authStorage.write(null);
    dispatch(signedOut());
    router.replace(Routes.Home);
  };

  return (
    <header className={classes.header}>
      <span className={classes.avatar}>
        <UserIcon size={24} />
      </span>

      <div className={classes.identity}>
        <p className={classes.email}>{user.email}</p>
        <p className={classes.meta}>
          {active > 0 ? activeLabel(active) : 'Активных подписок нет'}
          <span className={classes.separator} aria-hidden>
            ·
          </span>
          с нами с {formatDate(user.date_joined)}
        </p>
      </div>

      <div className={classes.actions}>
        <Button href={Routes.Activate} size="small">
          <KeyIcon size={16} />
          Активировать ключ
        </Button>
        <Button type="button" size="small" variant="ghost" onClick={signOut}>
          Выйти
        </Button>
      </div>
    </header>
  );
};

function activeLabel(count: number): string {
  const tail = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (!teen && tail === 1) return `${count} активная подписка`;
  if (!teen && tail >= 2 && tail <= 4) return `${count} активные подписки`;
  return `${count} активных подписок`;
}
