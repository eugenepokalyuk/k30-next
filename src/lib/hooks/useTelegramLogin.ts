'use client';

import { useState } from 'react';

import { apiErrorMessage } from '@/store/api/errors';
import {
  k30Api,
  useTelegramLoginStartMutation,
  useTelegramLoginStatusQuery,
} from '@/store/api/k30Api';
import type { TelegramStartDto } from '@/store/api/types';
import { useAppSelector } from '@/store/hooks';

/** Темп опроса заявки. Три секунды — столько же, сколько на экране
 *  активации: человек в это время переключается в телеграм и жмёт
 *  «Запустить», быстрее он всё равно не успевает. */
const POLL_MS = 3000;

/** Что показывает экран входа прямо сейчас. */
export type TelegramLoginStage =
  | 'idle'
  | 'waiting'
  | 'needs_email'
  /** Заявка устарела или потерялась — нужна новая ссылка. */
  | 'lost';

interface Result {
  stage: TelegramLoginStage;
  /** Живая заявка: по этой ссылке открывается бот. */
  link: TelegramStartDto | null;
  error: string;
  isStarting: boolean;
  start: () => Promise<void>;
}

/** Вход через телеграм-бота: заявка и ожидание подтверждения.
 *
 *  Опрос, а не webhook: витрина — статика на GitHub Pages, принимать
 *  входящие ей нечем.
 *
 *  Момент «вошли» здесь не обрабатывается вовсе — токены кладёт в стор
 *  сам эндпоинт (см. `onQueryStarted` в k30Api). Хук отвечает только на
 *  вопрос «что рисовать», и потому обходится без эффектов: всё
 *  состояние выводится из кэша запроса при отрисовке.
 */
export function useTelegramLogin(): Result {
  const [startLogin, { isLoading: isStarting }] =
    useTelegramLoginStartMutation();

  const [link, setLink] = useState<TelegramStartDto | null>(null);
  const [error, setError] = useState('');
  const nonce = link?.nonce ?? '';

  // Кэш читаем селектором, а не результатом хука ниже, ради одного:
  // темп опроса задаётся до самого опроса, и остановить его нужно тем
  // же ответом, который сообщил, что ждать больше нечего.
  const cached = useAppSelector(
    k30Api.endpoints.telegramLoginStatus.select(nonce),
  );

  const status = cached.data?.status;
  // 404 — заявки нет в базе: бэкенд перезапустили или ссылку открыли
  // из вкладки, провисевшей полчаса.
  const isMissing = (cached.error as { status?: number })?.status === 404;
  const isLost = status === 'expired' || isMissing;
  const isSettled = isLost || status === 'confirmed';

  useTelegramLoginStatusQuery(nonce, {
    skip: !nonce,
    // Ноль — так RTK Query понимает «больше не надо».
    pollingInterval: isSettled ? 0 : POLL_MS,
  });

  const start = async () => {
    setError('');

    try {
      const started = await startLogin().unwrap();
      setLink(started);
      // Открываем телеграм прямо в обработчике нажатия: вкладку,
      // открытую после ответа сервера, режет блокировщик всплывающих
      // окон — а эту браузер считает следствием клика.
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
  else if (link) stage = 'waiting';

  return {
    stage,
    link: stage === 'lost' ? null : link,
    error: error || (stage === 'lost' ? lostMessage : ''),
    isStarting,
    start,
  };
}
