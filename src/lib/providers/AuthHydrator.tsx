'use client';

import React, { FC } from 'react';

import { pendingLogin } from '@/lib/telegram';
import { k30Api } from '@/store/api/k30Api';
import { useAppDispatch } from '@/store/hooks';
import {
  authStorage,
  hydrated,
  profileLoaded,
  ready,
  signedOut,
  tokenRefreshed,
} from '@/store/slices/auth';

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export const AuthHydrator: FC = () => {
  const dispatch = useAppDispatch();
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;

    const refresh = authStorage.read();
    dispatch(hydrated(refresh));
    if (!refresh) {
      void resumeTelegramLogin();
      return;
    }

    const exchange = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });
        if (!response.ok) throw new Error('refresh rejected');

        const data = (await response.json()) as {
          access: string;
          refresh?: string;
        };

        dispatch(tokenRefreshed(data));
        if (data.refresh) authStorage.write(data.refresh);

        const profile = await fetch(`${apiUrl}/me`, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        if (profile.ok) dispatch(profileLoaded(await profile.json()));
      } catch {
        authStorage.write(null);
        dispatch(signedOut());
      } finally {
        dispatch(ready());
      }
    };

    async function resumeTelegramLogin() {
      const pending = pendingLogin.read();
      if (!pending) return;

      const result = await dispatch(
        k30Api.endpoints.telegramLoginStatus.initiate(pending.nonce, {
          forceRefetch: true,
        }),
      );

      const status = result.data?.status;
      const isWaiting =
        status === 'pending' ||
        status === 'needs_email' ||
        status === 'needs_code';

      if (!isWaiting) pendingLogin.write(null);
    }

    void exchange();
  }, [dispatch]);

  return null;
};
