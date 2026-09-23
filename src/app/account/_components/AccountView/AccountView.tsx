'use client';

import React, { FC } from 'react';
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
import { OrdersList } from '../OrdersList/OrdersList';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { PromosList } from '../PromosList/PromosList';
import { SubscriptionsList } from '../SubscriptionsList/SubscriptionsList';

export const AccountView: FC = () => {
  const router = useRouter();
  const isReady = useAppSelector(selectIsAuthReady);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const user = useAppSelector(selectUser);

  const { data: subscriptions } = useMySubscriptionsQuery(undefined, {
    skip: !isAuthorized,
  });

  React.useEffect(() => {
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
        <h1 className={classes.title}>Личный кабинет</h1>

        <AccountHeader user={user} active={subscriptions?.length ?? 0} />

        <ProfileCard user={user} />

        <SubscriptionsList />

        <section className={classes.orders}>
          <h2 className={classes.section_title}>Заказы</h2>
          <OrdersList />
        </section>

        <section className={classes.orders}>
          <h2 className={classes.section_title}>Промокоды</h2>
          <PromosList />
        </section>
      </div>
    </div>
  );
};
