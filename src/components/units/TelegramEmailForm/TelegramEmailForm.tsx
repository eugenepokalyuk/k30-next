'use client';

import React, { FC, FormEvent } from 'react';

import { Button, Field, Notice } from '@/components/ui';
import { useTelegramWebAppLoginMutation } from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTelegram,
  webAppNeedsEmail,
  webAppSignedIn,
} from '@/store/slices/telegram';

import classes from './TelegramEmailForm.module.scss';

interface Props {
  description?: string;
  className?: string;
}

export const TelegramEmailForm: FC<Props> = ({ description, className }) => {
  const dispatch = useAppDispatch();
  const { initData } = useAppSelector(selectTelegram);

  const [login, { isLoading, error }] = useTelegramWebAppLoginMutation();
  const [email, setEmail] = React.useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    const result = await login({ init_data: initData, email: email.trim() });
    if ('data' in result && result.data?.status === 'confirmed') {
      dispatch(webAppSignedIn());
    } else if ('data' in result) {
      dispatch(webAppNeedsEmail());
    }
  };

  const detail =
    error && 'data' in error
      ? (error.data as { detail?: string } | undefined)?.detail
      : undefined;

  return (
    <form className={`${classes.form} ${className ?? ''}`} onSubmit={submit}>
      {description && <p className={classes.description}>{description}</p>}

      <Field
        label="Почта"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        hint="На неё придут ключ и чек. Пароль придумывать не нужно."
        enterKeyHint="done"
      />

      {detail && (
        <Notice tone="error" title="Не получилось">
          {detail}
        </Notice>
      )}

      <Button type="submit" loading={isLoading} fullWidth size="large">
        Продолжить
      </Button>
    </form>
  );
};
