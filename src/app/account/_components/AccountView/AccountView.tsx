'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

import {
  useMyPromosQuery,
  useMyReferralsQuery,
  useMySubscriptionsQuery,
} from '@/store/api/k30Api';
import { useAppSelector } from '@/store/hooks';
import {
  selectIsAuthorized,
  selectIsAuthReady,
  selectUser,
} from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './AccountView.module.scss';
import { OrdersList } from '../OrdersList/OrdersList';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import type { ProfileTab } from '../ProfileTabs/ProfileTabs';
import { ProfileTabs } from '../ProfileTabs/ProfileTabs';
import { PromosList } from '../PromosList/PromosList';
import { ReferralCard } from '../ReferralCard/ReferralCard';
import { SubscriptionsList } from '../SubscriptionsList/SubscriptionsList';

export const AccountView: FC = () => {
  const router = useRouter();
  const isReady = useAppSelector(selectIsAuthReady);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const user = useAppSelector(selectUser);

  const { data: subscriptions } = useMySubscriptionsQuery(undefined, {
    skip: !isAuthorized,
  });
  const { data: promos } = useMyPromosQuery(undefined, { skip: !isAuthorized });
  const { data: referrals } = useMyReferralsQuery(undefined, {
    skip: !isAuthorized,
  });

  React.useEffect(() => {
    if (isReady && !isAuthorized) router.replace(Routes.Login);
  }, [isReady, isAuthorized, router]);

  const tabs: ProfileTab[] = [
    { id: 'orders', label: 'Покупки', content: <OrdersList /> },
  ];

  if (promos?.length) {
    tabs.push({
      id: 'promos',
      label: 'Промокоды',
      content: <PromosList promos={promos} />,
    });
  }

  if (referrals?.is_enabled) {
    tabs.push({
      id: 'referrals',
      label: 'Реферальная программа',
      content: <ReferralCard />,
    });
  }

  if (!isReady || !isAuthorized || !user) {
    return (
      <div className={classes.page}>
        <div className={classes.container}>
          <p className={classes.loading}>Загружаем профиль</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <h1 className={classes.title}>Профиль</h1>

        <ProfileCard user={user} active={subscriptions?.length ?? 0} />

        <ProfileTabs tabs={tabs} />

        <SubscriptionsList />
      </div>
    </div>
  );
};
