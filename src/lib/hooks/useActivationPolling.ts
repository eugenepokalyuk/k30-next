'use client';

import React from 'react';

import { useActivationStatusQuery } from '@/store/api/k30Api';
import type { ActivationDto } from '@/store/api/types';

const TERMINAL = ['success', 'failed', 'cancelled', 'review'];

interface Result {
  activation: ActivationDto | null;
  elapsed: number;
  isPolling: boolean;
}

export function useActivationPolling(
  id: string | null,
  initial: ActivationDto | null,
): Result {
  const [elapsed, setElapsed] = React.useState(0);

  const isDone = Boolean(initial && TERMINAL.includes(initial.status));

  const interval = isDone ? 0 : Math.max(1, initial?.poll_after ?? 3) * 1000;

  const { data } = useActivationStatusQuery(id ?? '', {
    skip: !id || isDone,
    pollingInterval: interval,
    skipPollingIfUnfocused: true,
  });

  const activation = data?.activation ?? initial;
  const createdAt = activation?.created_at;

  React.useEffect(() => {
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
