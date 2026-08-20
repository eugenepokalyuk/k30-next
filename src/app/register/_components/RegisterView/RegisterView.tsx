'use client';

import React, { FC, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Field } from '@/components/ui';
import { AuthCard } from '@/components/units';
import { apiErrorMessage } from '@/store/api/errors';
import { useRegisterMutation } from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authStorage, selectIsAuthorized, signedIn } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './RegisterView.module.scss';

const MIN_PASSWORD = 8;

export const RegisterView: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthorized) router.replace(Routes.Account);
  }, [isAuthorized, router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    // Длину проверяем на месте: то же правило стоит на бэкенде, но
    // гонять запрос ради заведомо короткого пароля незачем.
    if (password.length < MIN_PASSWORD) {
      setError(`Пароль должен быть не короче ${MIN_PASSWORD} символов.`);
      return;
    }

    try {
      const response = await register({ email, password, name }).unwrap();
      dispatch(signedIn(response));
      authStorage.write(response.refresh);
      router.replace(Routes.Account);
    } catch (exception) {
      setError(
        apiErrorMessage(
          exception,
          'Не получилось зарегистрироваться. Попробуйте ещё раз.',
        ),
      );
    }
  };

  return (
    <AuthCard
      title="Регистрация"
      description="Нужна только почта и пароль. Активировать ключ можно и без аккаунта — кабинет хранит историю покупок."
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link className={classes.link} href={Routes.Login}>
            Войдите
          </Link>
        </>
      }
    >
      <form className={classes.form} onSubmit={submit} noValidate>
        <Field
          label="Имя"
          name="name"
          autoComplete="name"
          placeholder="Как к вам обращаться"
          value={name}
          onChange={setName}
          hint="Необязательно."
        />

        <Field
          label="Почта"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(next) => {
            setEmail(next);
            if (error) setError('');
          }}
        />

        <Field
          label="Пароль"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(next) => {
            setPassword(next);
            if (error) setError('');
          }}
          error={error}
          hint={`Не короче ${MIN_PASSWORD} символов.`}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          Зарегистрироваться
        </Button>
      </form>
    </AuthCard>
  );
};
