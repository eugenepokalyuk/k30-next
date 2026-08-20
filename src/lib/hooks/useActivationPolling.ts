'use client';

import { useEffect, useState } from 'react';

import { useActivationStatusQuery } from '@/store/api/k30Api';
import type { ActivationDto } from '@/store/api/types';

/** Опрос статуса активации.
 *
 *  Темп задаёт бэкенд полем `poll_after`, а не мы. Так и должно быть: у
 *  поставщиков разные лимиты и разные рекомендации (один просит три
 *  секунды, другой два-пять), и знание об этом должно жить в одном
 *  месте — в адаптере поставщика. Витрина просто слушается.
 *
 *  Опрос останавливается сам, когда активация дошла до окончательного
 *  состояния. Отдельная остановка «по таймауту» здесь не нужна: бэкенд
 *  сам переведёт зависшую активацию в «разбираем вручную», и это придёт
 *  очередным ответом.
 */

const TERMINAL = ['success', 'failed', 'cancelled', 'review'];

interface Result {
  activation: ActivationDto | null;
  /** Секунд с начала активации — для «ждём дольше обычного». */
  elapsed: number;
  isPolling: boolean;
}

export function useActivationPolling(
  id: string | null,
  initial: ActivationDto | null,
): Result {
  const [elapsed, setElapsed] = useState(0);

  const isDone = Boolean(initial && TERMINAL.includes(initial.status));

  // Интервал опроса берём из последнего ответа. Ноль отключает опрос —
  // именно так RTK Query понимает «больше не надо».
  const interval = isDone ? 0 : Math.max(1, initial?.poll_after ?? 3) * 1000;

  const { data } = useActivationStatusQuery(id ?? '', {
    skip: !id || isDone,
    pollingInterval: interval,
    // Вкладку с активацией часто уводят в фон, пока ждут. Продолжать
    // опрос там незачем — вернутся, и первый же запрос покажет итог.
    skipPollingIfUnfocused: true,
  });

  const activation = data?.activation ?? initial;
  const createdAt = activation?.created_at;

  // Отсчёт ведём от начала активации, а не от монтирования компонента:
  // покупатель мог закрыть вкладку и вернуться по ссылке, и «ждём три
  // секунды» тогда было бы неправдой.
  useEffect(() => {
    if (isDone || !createdAt) return;

    const startedAt = new Date(createdAt).getTime();
    const tick = () =>
      setElapsed(Math.max(0, Math.round((Date.now() - startedAt) / 1000)));

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [isDone, createdAt]);

  return {
    activation,
    elapsed,
    isPolling: Boolean(id) && !isDone,
  };
}
