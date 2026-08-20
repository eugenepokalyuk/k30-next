'use client';

import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Field, UserIcon } from '@/components/ui';
import { useUpdateMeMutation } from '@/store/api/k30Api';
import type { UserDto } from '@/store/api/types';
import { useAppDispatch } from '@/store/hooks';
import { authStorage, profileLoaded, signedOut } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';
import { formatDate } from '@/utils/helpers';

import classes from './ProfileCard.module.scss';

interface Props {
  user: UserDto;
}

export const ProfileCard: FC<Props> = ({ user }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  // Профиль приезжает асинхронно (после обмена refresh на access), но
  // родитель не рендерит карточку, пока его нет, — поэтому начальные
  // значения полей берутся из пропса один раз и синхронизировать их
  // эффектом не нужно.
  const [name, setName] = useState(user.name);
  const [telegram, setTelegram] = useState(user.telegram_username);
  const [saved, setSaved] = useState(false);

  // Подпись «Сохранено» возвращается к «Сохранить» через две секунды.
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const updated = await updateMe({
        name,
        telegram_username: telegram,
      }).unwrap();
      dispatch(profileLoaded(updated));
      setSaved(true);
    } catch {
      // Сохранение профиля — не тот сценарий, ради которого стоит
      // городить экран ошибки: значения в полях остались, кнопка снова
      // активна, повторный клик обычно проходит.
    }
  };

  const signOut = () => {
    authStorage.write(null);
    dispatch(signedOut());
    router.replace(Routes.Home);
  };

  return (
    <section className={classes.card}>
      <header className={classes.header}>
        <span className={classes.avatar}>
          <UserIcon size={22} />
        </span>
        <div className={classes.identity}>
          <p className={classes.email}>{user.email}</p>
          <p className={classes.since}>
            С нами с {formatDate(user.date_joined)}
          </p>
        </div>
      </header>

      <form className={classes.form} onSubmit={save}>
        <Field label="Имя" name="name" value={name} onChange={setName} />
        <Field
          label="Telegram"
          name="telegram"
          placeholder="@username"
          value={telegram}
          onChange={setTelegram}
          hint="По нему сходятся заказы из телеграма с этим кабинетом."
        />

        <div className={classes.actions}>
          <Button type="submit" size="small" loading={isLoading}>
            {saved ? 'Сохранено' : 'Сохранить'}
          </Button>
          <Button type="button" size="small" variant="ghost" onClick={signOut}>
            Выйти
          </Button>
        </div>
      </form>
    </section>
  );
};
