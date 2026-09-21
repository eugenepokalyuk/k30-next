'use client';

import React from 'react';

import { apiErrorMessage } from '@/store/api/errors';
import { useTelegramWidgetLoginMutation } from '@/store/api/k30Api';
import type { TelegramWidgetUser } from '@/store/api/types';

export type WidgetStage = 'idle' | 'needs_email';

interface Result {
  stage: WidgetStage;
  error: string;
  isSending: boolean;
  email: string;
  setEmail: (value: string) => void;
  authorize: (user: TelegramWidgetUser) => Promise<void>;
  submitEmail: () => Promise<void>;
}

export function useTelegramWidgetLogin(): Result {
  const [login, { isLoading }] = useTelegramWidgetLoginMutation();

  const [stage, setStage] = React.useState<WidgetStage>('idle');
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [user, setUser] = React.useState<TelegramWidgetUser | null>(null);

  const send = async (telegram: TelegramWidgetUser, address?: string) => {
    setError('');

    try {
      const result = await login({
        telegram,
        ...(address ? { email: address } : {}),
      }).unwrap();

      if (result.status === 'needs_email') {
        setUser(telegram);
        setStage('needs_email');
      }
    } catch (exception) {
      setError(
        apiErrorMessage(
          exception,
          'Не получилось войти через Telegram. Попробуйте ещё раз или войдите по почте.',
        ),
      );
    }
  };

  return {
    stage,
    error,
    isSending: isLoading,
    email,
    setEmail,
    authorize: (telegram) => send(telegram),
    submitEmail: async () => {
      if (!user || !email.trim()) return;
      await send(user, email.trim());
    },
  };
}
