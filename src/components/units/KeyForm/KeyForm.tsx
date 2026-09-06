'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Field } from '@/components/ui';
import { apiErrorMessage } from '@/store/api/errors';
import { useVerifyKeyMutation } from '@/store/api/k30Api';
import { useAppDispatch } from '@/store/hooks';
import { keyVerified } from '@/store/slices/activation';
import { activateRoute } from '@/utils/consts';
import { formatKey, isKeyComplete } from '@/utils/helpers';

import classes from './KeyForm.module.scss';

export const KeyForm: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verifyKey, { isLoading }] = useVerifyKeyMutation();

  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isKeyComplete(value)) {
      setError('Код состоит из 15 символов: K30-XXXX-XXXX-XXXXXX-X');
      return;
    }

    try {
      const response = await verifyKey(value).unwrap();

      if (!response.success || !response.key || !response.service) {
        setError(response.error || 'Ключ не найден. Проверьте код.');
        return;
      }

      dispatch(
        keyVerified({
          code: response.key.code,
          service: response.service,
          key: response.key,
          targets: response.targets ?? [],
          canActivate: Boolean(response.can_activate),
          message: response.message ?? '',
          activation: response.activation ?? null,
        }),
      );
      router.push(activateRoute(response.key.code));
    } catch (exception) {
      setError(
        apiErrorMessage(
          exception,
          'Не получилось связаться с сервером. Попробуйте ещё раз.',
        ),
      );
    }
  };

  return (
    <form className={classes.form} onSubmit={submit} noValidate>
      <Field
        label="Ключ активации"
        placeholder="K30-XXXX-XXXX-XXXXXX-X"
        value={value}
        onChange={(next) => {
          setValue(formatKey(next));
          if (error) setError('');
        }}
        error={error}
        hint="Код из письма после оплаты. Регистр и дефисы можно не соблюдать"
        inputClassName={classes.input}
        name="key"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="go"
      />

      <Button type="submit" size="large" loading={isLoading}>
        {'Проверить ключ'}
      </Button>
    </form>
  );
};
