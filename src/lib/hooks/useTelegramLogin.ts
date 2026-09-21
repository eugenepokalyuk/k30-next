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

/** Темп опроса заявки */
const POLL_MS = 3000;

/** Что показывает экран входа прямо сейчас */
export type TelegramLoginStage =
  | 'idle'
  | 'waiting'
  | 'needs_email'
  | 'needs_code'
  /** Заявка устарела или потерялась — нужна новая ссылка */
  | 'lost';

interface Result {
  stage: TelegramLoginStage;
  /** Живая заявка: по этой ссылке открывается бот */
  link: TelegramStartDto | null;
  error: string;
  isStarting: boolean;
  start: () => Promise<void>;
}

/** Вход через телеграм-бота: заявка и ожидание подтверждения */
export function useTelegramLogin(): Result {
  const [startLogin, { isLoading: isStarting }] =
    useTelegramLoginStartMutation();

  const [link, setLink] = React.useState<TelegramStartDto | null>(null);
  const [error, setError] = React.useState('');
  // Заявка не с этой страницы, а из хранилища: про неё человек уже забыл
  const [isRestored, setIsRestored] = React.useState(false);
  const nonce = link?.nonce ?? '';

  // Заявку с прошлого открытия подхватываем после первой отрисовки:
  // localStorage на сервере нет, а разойтись разметка не должна
  React.useEffect(() => {
    const stored = pendingLogin.read();
    if (!stored) return;

    setLink((current) => current ?? stored);
    setIsRestored(true);
  }, []);

  // Кэш читаем селектором, а не результатом хука ниже, ради одного: темп
  // опроса задаётся до самого опроса, и остановить его нужно тем же
  // ответом, который сообщил, что ждать больше нечего
  const cached = useAppSelector(
    k30Api.endpoints.telegramLoginStatus.select(nonce),
  );

  const status = cached.data?.status;
  // 404 — заявки нет в базе: бэкенд перезапустили или ссылку открыли из
  // вкладки, провисевшей полчаса
  const isMissing = (cached.error as { status?: number })?.status === 404;
  const isLost = status === 'expired' || isMissing;
  const isSettled = isLost || status === 'confirmed';

  useTelegramLoginStatusQuery(nonce, {
    skip: !nonce,
    // Ноль — так RTK Query понимает «больше не надо»
    pollingInterval: isSettled ? 0 : POLL_MS,
  });

  // Отработавшая заявка ничего не стоит хранить: nonce одноразовый, и
  // следующий вход начнётся с новой ссылки
  React.useEffect(() => {
    if (isSettled) pendingLogin.write(null);
  }, [isSettled]);

  // Заявка из хранилища могла давно закончиться — например, токены забрал
  // другой экран. Про такую молчим: человек только открыл страницу и
  // ошибку о своём входе получасовой давности не ждёт
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
      // Открываем телеграм прямо в обработчике нажатия: вкладку, открытую
      // после ответа сервера, режет блокировщик всплывающих окон — а эту
      // браузер считает следствием клика
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
