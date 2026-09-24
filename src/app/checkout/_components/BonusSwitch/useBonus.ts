'use client';

import React from 'react';

import { useMyBonusesQuery } from '@/store/api/k30Api';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthorized } from '@/store/slices/auth';

interface Options {
  service: string;
  plan: string;
  skip: boolean;
  onUse: () => void;
}

export const useBonus = ({ service, plan, skip, onUse }: Options) => {
  const isAuthorized = useAppSelector(selectIsAuthorized);

  const { data } = useMyBonusesQuery(
    { service, plan },
    { skip: skip || !isAuthorized || !service || !plan },
  );

  const [isOn, setIsOn] = React.useState(false);

  const available = data?.available ?? '0.00';
  const isAvailable = Boolean(data?.is_enabled) && Number(available) > 0;

  React.useEffect(() => {
    if (!isAvailable) setIsOn(false);
  }, [isAvailable]);

  return {
    balance: data?.balance ?? '0.00',
    available,
    isAvailable,
    isOn: isOn && isAvailable,
    toggle: () => {
      setIsOn((current) => {
        if (!current) onUse();
        return !current;
      });
    },
    reset: () => setIsOn(false),
  };
};

export type Bonus = ReturnType<typeof useBonus>;
