'use client';

import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useMySubscriptionsQuery } from '@/store/api/k30Api';
import { useAppSelector } from '@/store/hooks';
import {
  selectIsAuthorized,
  selectIsAuthReady,
  selectUser,
} from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './AccountView.module.scss';
import { AccountHeader } from '../AccountHeader/AccountHeader';
import { ActivationsList } from '../ActivationsList/ActivationsList';
import { OrdersList } from '../OrdersList/OrdersList';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { SubscriptionsList } from '../SubscriptionsList/SubscriptionsList';

/**
 * Кабинет: что работает сейчас, что куплено, что пошло не так.
 *
 * Порядок блоков — это порядок вопросов, с которыми сюда заходят.
 * Сначала живые подписки и их сроки, потом покупки целиком, и только
 * потом история попыток активации. Профиль ушёл в самый низ страницы —
 * его правят раз в жизни, а раньше он занимал первый экран.
 */
export const AccountView: FC = () => {
  const router = useRouter();
  const isReady = useAppSelector(selectIsAuthReady);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const user = useAppSelector(selectUser);

  // Число активных подписок нужно шапке, а запрос всё равно делает блок
  // подписок ниже: RTK Query отдаёт обоим один ответ из кэша.
  const { data: subscriptions } = useMySubscriptionsQuery(undefined, {
    skip: !isAuthorized,
  });

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
        {/* Заголовок страницы остался, но подписью: имя раздела и так
            стоит в шапке сайта, а разворачивать его в крупный заголовок
            значит отодвинуть подписки ниже сгиба ради слов, которые
            покупатель и так знает. */}
        <h1 className={classes.title}>Личный кабинет</h1>

        <AccountHeader user={user} active={subscriptions?.length ?? 0} />

        <SubscriptionsList />

        <section className={classes.orders}>
          <h2 className={classes.section_title}>Заказы</h2>
          <OrdersList />
        </section>

        {/* История попыток — ниже заказов и только если они были. Она
            отвечает на «почему не заработало», а этот вопрос возникает
            после того, как покупку уже нашли глазами. */}
        <ActivationsList />

        <ProfileCard user={user} />
      </div>
    </div>
  );
};
