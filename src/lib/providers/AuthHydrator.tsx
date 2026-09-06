'use client';

import { FC, useEffect, useRef } from 'react';

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

/** Восстанавливает вход при загрузке вкладки */
export const AuthHydrator: FC = () => {
  const dispatch = useAppDispatch();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const refresh = authStorage.read();
    dispatch(hydrated(refresh));
    if (!refresh) return;

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
        // Токен протух или бэкенд недоступен — показываем витрину как
        // анонимную
        authStorage.write(null);
        dispatch(signedOut());
      } finally {
        dispatch(ready());
      }
    };

    void exchange();
  }, [dispatch]);

  return null;
};
