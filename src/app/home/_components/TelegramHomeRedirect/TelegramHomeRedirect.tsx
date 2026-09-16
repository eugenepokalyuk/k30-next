'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/store/hooks';
import { selectIsMiniApp } from '@/store/slices/telegram';
import { Routes } from '@/utils/consts';

export const TelegramHomeRedirect: FC = () => {
  const router = useRouter();
  const isMiniApp = useAppSelector(selectIsMiniApp);

  React.useEffect(() => {
    if (isMiniApp) router.replace(Routes.Tg);
  }, [isMiniApp, router]);

  return null;
};
