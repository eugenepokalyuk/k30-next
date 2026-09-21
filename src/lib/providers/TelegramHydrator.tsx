'use client';

import React, { FC } from 'react';

import { getWebApp } from '@/lib/telegram';
import { useTelegramWebAppLoginMutation } from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthorized, selectIsAuthReady } from '@/store/slices/auth';
import {
  modeDetected,
  webAppAuthFailed,
  webAppAuthStarted,
  webAppNeedsEmail,
  webAppSignedIn,
} from '@/store/slices/telegram';

export const TelegramHydrator: FC = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isAuthReady = useAppSelector(selectIsAuthReady);

  const [login] = useTelegramWebAppLoginMutation();
  const started = React.useRef(false);

  React.useEffect(() => {
    const app = getWebApp();
    const initData = app?.initData ?? '';

    if (!initData) {
      dispatch(modeDetected({ mode: 'browser' }));
      return;
    }

    dispatch(modeDetected({ mode: 'mini_app', initData }));

    app?.ready();
    app?.expand();
  }, []);

  React.useEffect(() => {
    if (!isAuthReady || isAuthorized || started.current) return;

    const initData = getWebApp()?.initData;
    if (!initData) return;

    started.current = true;
    dispatch(webAppAuthStarted());

    void (async () => {
      try {
        const result = await login({ init_data: initData }).unwrap();
        if (result.status === 'needs_email') dispatch(webAppNeedsEmail());
        else dispatch(webAppSignedIn());
      } catch {
        dispatch(
          webAppAuthFailed(
            'Не получилось войти через Telegram. Откройте приложение заново ' +
              'или войдите по почте.',
          ),
        );
      }
    })();
  }, [isAuthReady, isAuthorized, login]);

  return null;
};
