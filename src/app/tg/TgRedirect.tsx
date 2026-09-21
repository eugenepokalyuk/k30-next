'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

import { Routes } from '@/utils/consts';

export const TgRedirect: FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.replace(Routes.Home);
  }, [router]);

  return null;
};
