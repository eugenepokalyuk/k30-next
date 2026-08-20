'use client';

import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/store/hooks';
import {
  selectIsAuthorized,
  selectIsAuthReady,
  selectUser,
} from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './AccountView.module.scss';
import { ActivationsList } from '../ActivationsList/ActivationsList';
import { OrdersList } from '../OrdersList/OrdersList';
import { ProfileCard } from '../ProfileCard/ProfileCard';

export const AccountView: FC = () => {
  const router = useRouter();
  const isReady = useAppSelector(selectIsAuthReady);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const user = useAppSelector(selectUser);

  // Уводим на вход только после того, как восстановили сессию из
  // localStorage: до этого «не авторизован» — ещё не ответ, и вошедшего
  // выкидывало бы отсюда при каждом обновлении страницы.
  useEffect(() => {
    if (isReady && !isAuthorized) router.replace(Routes.Login);
  }, [isReady, isAuthorized, router]);

  if (!isReady || !isAuthorized || !user) {
    return (
      <div className={classes.page}>
        <div className={classes.container}>
          <p className={classes.loading}>Загружаем кабинет</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <header className={classes.header}>
          <h1 className={classes.title}>Личный кабинет</h1>

          <p className={classes.subtitle}>
            Покупки, ключи и их статусы активации.
          </p>
        </header>

        <div className={classes.layout}>
          {/* Профиль слева и залипает при прокрутке: список заказов
              длиннее него, и без этого кнопка «Выйти» уезжала вверх
              вместе с карточкой. */}
          <aside className={classes.sidebar}>
            <ProfileCard user={user} />
          </aside>

          <section className={classes.orders}>
            <h2 className={classes.orders_title}>Заказы</h2>
            <OrdersList />

            {/* История попыток — ниже заказов и только если они были.
                Она отвечает на «почему не заработало», а этот вопрос
                возникает после того, как покупку уже нашли глазами. */}
            <ActivationsList />
          </section>
        </div>
      </div>
    </div>
  );
};
