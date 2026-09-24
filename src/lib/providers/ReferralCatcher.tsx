'use client';

import React, { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Routes } from '@/utils/consts';
import { referralStorage } from '@/utils/helpers';

export const ReferralCatcher: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get('ref') ?? '').trim().toUpperCase().slice(0, 12);
    if (!code) return;

    referralStorage.write(code);

    if (pathname?.startsWith(Routes.Invite)) return;

    router.replace(`${Routes.Invite}?ref=${encodeURIComponent(code)}`);
  }, [pathname, router]);

  return null;
};
