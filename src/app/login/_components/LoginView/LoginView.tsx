'use client';

import React, { FC, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Field } from '@/components/ui';
import { AuthCard } from '@/components/units';
import { apiErrorMessage } from '@/store/api/errors';
import { useLoginMutation } from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authStorage, selectIsAuthorized, signedIn } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './LoginView.module.scss';

export const LoginView: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Вошедшему на странице входа делать нечего — в том числе если он
  // вернулся сюда кнопкой «назад».
  useEffect(() => {
    if (isAuthorized) router.replace(Routes.Account);
  }, [isAuthorized, router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(signedIn(response));
      authStorage.write(response.refresh);
      router.replace(Routes.Account);
    } catch (exception) {
      setError(
        apiErrorMessage(exception, 'Не получилось войти. Попробуйте ещё раз.'),
      );
    }
  };

  return (
    <AuthCard
      title="Вход"
      description="Кабинет показывает ваши покупки и статусы активации."
      footer={
        <>
          Нет аккаунта?{' '}
          <Link className={classes.link} href={Routes.Register}>
            Зарегистрируйтесь
          </Link>
        </>
      }
    >
      <form className={classes.form} onSubmit={submit} noValidate>
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(next) => {
            setPassword(next);
            if (error) setError('');
          }}
          error={error}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          Войти
        </Button>
      </form>
    </AuthCard>
  );
};
