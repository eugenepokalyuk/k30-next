'use client';

import React, { FC, FormEvent, useEffect, useState } from 'react';

import { Button, Field } from '@/components/ui';
import { useUpdateMeMutation } from '@/store/api/k30Api';
import type { UserDto } from '@/store/api/types';
import { useAppDispatch } from '@/store/hooks';
import { profileLoaded } from '@/store/slices/auth';

import classes from './ProfileCard.module.scss';

interface Props {
  user: UserDto;
}

/** Как к покупателю обращаться и где его искать в телеграме.
 *
 *  Почты и кнопки «Выйти» здесь больше нет — они уехали в шапку
 *  кабинета. Заходят сюда не за формой, а посмотреть подписки, и
 *  пустое поле «Имя» первым экраном отвечало не на тот вопрос.
 */
export const ProfileCard: FC<Props> = ({ user }) => {
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

  return (
    <section className={classes.card}>
      <h2 className={classes.title}>Профиль</h2>

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
        </div>
      </form>
    </section>
  );
};
