'use client';

import React, { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Field } from '@/components/ui';
import { throttleMessage } from '@/store/api/errors';
import { useVerifyKeyMutation } from '@/store/api/k30Api';
import { useAppDispatch } from '@/store/hooks';
import { keyVerified } from '@/store/slices/activation';
import { activateRoute } from '@/utils/consts';
import { formatKey, isKeyComplete } from '@/utils/helpers';

import classes from './KeyForm.module.scss';

/** Поле ввода ключа с главной — вход во весь сценарий активации.
 *
 *  Проверяет код на бэкенде и, если всё в порядке, уводит на /activate.
 *  Результат кладём в стор: на той странице уже есть и инструкция, и
 *  поля формы, второй запрос делать незачем.
 */
export const KeyForm: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verifyKey, { isLoading }] = useVerifyKeyMutation();

  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    // Длину проверяем на месте: слать заведомо неполный код на сервер
    // значит тратить лимит запросов на каждую опечатку.
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
          // Состав формы приезжает уже здесь — страница активации
          // откроется без второго запроса к бэкенду.
          targets: response.targets ?? [],
          canActivate: Boolean(response.can_activate),
          message: response.message ?? '',
          activation: response.activation ?? null,
        }),
      );
      router.push(activateRoute(response.key.code));
    } catch (exception) {
      // Сеть или бэкенд отвалились. Про ключ мы ничего не узнали —
      // так и говорим, а не «ключ неверный».
      setError(
        throttleMessage(exception) ??
          'Не получилось связаться с сервером. Попробуйте ещё раз.',
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
        // Мобильная клавиатура открывается сразу в верхнем регистре, а
        // автозамена выключена: код из букв и цифр iOS охотно правит на
        // похожее слово, и это видно уже после отправки.
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="go"
      />

      <Button type="submit" size="large" loading={isLoading}>
        Проверить ключ
      </Button>
    </form>
  );
};
