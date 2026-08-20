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

/** Восстанавливает вход при загрузке вкладки.
 *
 *  Читает refresh из localStorage и меняет его на свежий access. Пока
 *  обмен не закончился, `isReady` = false: без этого кабинет успел бы
 *  решить, что пользователь не залогинен, и увёл бы его на вход при
 *  каждом обновлении страницы.
 *
 *  Запрос идёт мимо RTK Query намеренно — он должен случиться ровно один
 *  раз при старте и до того, как остальные хуки начнут ходить с пустым
 *  заголовком.
 *
 *  Токен читаем из хранилища, а не из стора, и держим засов в ref.
 *  Причина: у нас включена ротация refresh-токенов, обмен кладёт в стор
 *  новый — и эффект, подписанный на это значение, запускал бы сам себя
 *  по кругу.
 */
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
        // анонимную. Ошибку наверх не поднимаем: вход не главный сценарий,
        // ключ можно активировать и без кабинета.
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
