'use client';

import { useAppSelector } from '@/store/hooks';
import { selectIsMiniApp } from '@/store/slices/telegram';
import { Routes } from '@/utils/consts';

export const useHomeRoute = (): string => {
  const isMiniApp = useAppSelector(selectIsMiniApp);

  return isMiniApp ? Routes.Tg : Routes.Home;
};
