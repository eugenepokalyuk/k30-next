'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

import { Routes } from '@/utils/consts';

export const TgRedirect: FC = () => {
  const router = useRouter();

  // replace, а не push: возврат «назад» должен уводить туда, откуда пришли,
  // а не обратно на переадресацию
  React.useEffect(() => {
    router.replace(Routes.Home);
  }, [router]);

  return null;
};
