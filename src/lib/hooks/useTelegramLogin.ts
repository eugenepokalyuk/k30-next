'use client';

import React from 'react';

import { pendingLogin } from '@/lib/telegram';
import { apiErrorMessage } from '@/store/api/errors';
import {
  k30Api,
  useTelegramLoginStartMutation,
  useTelegramLoginStatusQuery,
} from '@/store/api/k30Api';
import type { TelegramStartDto } from '@/store/api/types';
import { useAppSelector } from '@/store/hooks';

const POLL_MS = 3000;

export type TelegramLoginStage =
  | 'idle'
  | 'waiting'
  | 'needs_email'
  | 'needs_code'
  | 'lost';

interface Result {
  stage: TelegramLoginStage;
  link: TelegramStartDto | null;
  error: string;
  isStarting: boolean;
  start: () => Promise<void>;
}

export function useTelegramLogin(): Result {
  const [startLogin, { isLoading: isStarting }] =
    useTelegramLoginStartMutation();

  const [link, setLink] = React.useState<TelegramStartDto | null>(null);
  const [error, setError] = React.useState('');
  const [isRestored, setIsRestored] = React.useState(false);
  const nonce = link?.nonce ?? '';

  React.useEffect(() => {
    const stored = pendingLogin.read();
    if (!stored) return;

    setLink((current) => current ?? stored);
    setIsRestored(true);
  }, []);

  const cached = useAppSelector(
    k30Api.endpoints.telegramLoginStatus.select(nonce),
  );

  const status = cached.data?.status;
  const isMissing = (cached.error as { status?: number })?.status === 404;
  const isLost = status === 'expired' || isMissing;
  const isSettled = isLost || status === 'confirmed';

  useTelegramLoginStatusQuery(nonce, {
    skip: !nonce,
    pollingInterval: isSettled ? 0 : POLL_MS,
  });

  React.useEffect(() => {
    if (isSettled) pendingLogin.write(null);
  }, [isSettled]);

  React.useEffect(() => {
    if (!isRestored || !isLost) return;
    setLink(null);
    setIsRestored(false);
  }, [isLost, isRestored]);

  const start = async () => {
    setError('');
    setIsRestored(false);

    try {
      const started = await startLogin().unwrap();
      setLink(started);
      pendingLogin.write(started);
      window.open(started.url, '_blank', 'noopener,noreferrer');
    } catch (exception) {
      setError(
        apiErrorMessage(
          exception,
          'Не получилось начать вход. Попробуйте ещё раз или напишите в поддержку.',
        ),
      );
    }
  };

  const lostMessage = isMissing
    ? 'Заявка не найдена — начните вход заново.'
    : 'Ссылка на бота живёт пять минут и уже устарела. Нажмите кнопку ещё раз — сделаем новую.';

  let stage: TelegramLoginStage = 'idle';
  if (link && isLost) stage = 'lost';
  else if (status === 'needs_email') stage = 'needs_email';
  else if (status === 'needs_code') stage = 'needs_code';
  else if (link) stage = 'waiting';

  return {
    stage,
    link: stage === 'lost' ? null : link,
    error: error || (stage === 'lost' ? lostMessage : ''),
    isStarting,
    start,
  };
}
