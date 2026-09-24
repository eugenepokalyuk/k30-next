'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import {
  Button,
  ChevronDownIcon,
  Field,
  KeyIcon,
  UserIcon,
} from '@/components/ui';
import { useUpdateMeMutation } from '@/store/api/k30Api';
import type { UserDto } from '@/store/api/types';
import { useAppDispatch } from '@/store/hooks';
import { authStorage, profileLoaded, signedOut } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';
import { formatDate } from '@/utils/helpers';

import classes from './ProfileCard.module.scss';

interface Props {
  user: UserDto;
  active: number;
}

export const ProfileCard: FC<Props> = ({ user, active }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const id = React.useId();

  const [name, setName] = React.useState(user.name);
  const [telegram, setTelegram] = React.useState(user.telegram_username);
  const [saved, setSaved] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const signOut = () => {
    authStorage.write(null);
    dispatch(signedOut());
    router.replace(Routes.Home);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updated = await updateMe({
        name,
        telegram_username: telegram,
      }).unwrap();
      dispatch(profileLoaded(updated));
      setSaved(true);
      if (updated.name.trim() && updated.telegram_username.trim()) {
        setIsOpen(false);
      }
    } catch {
    }
  };

  const summary = [name.trim(), telegram.trim()].filter(Boolean).join(' · ');

  return (
    <section className={classes.card}>
      <header className={classes.identity}>
        <span className={classes.avatar}>
          <UserIcon size={24} />
        </span>

        <div className={classes.person}>
          <p className={classes.email}>{user.email}</p>
          <p className={classes.meta}>
            {active > 0 ? activeLabel(active) : 'Активных подписок нет'}
            <span className={classes.separator} aria-hidden>
              ·
            </span>
            с нами с {formatDate(user.date_joined)}
          </p>
        </div>

        <div className={classes.top_actions}>
          <Button href={Routes.Activate} size="small">
            <KeyIcon size={16} />
            Активировать ключ
          </Button>
          <Button type="button" size="small" variant="ghost" onClick={signOut}>
            Выйти
          </Button>
        </div>
      </header>

      <h2 className={classes.heading}>
        <button
          type="button"
          className={classes.toggle}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls={id}
        >
          <span className={classes.head}>
            <span className={classes.title}>Личные данные</span>

            {!isOpen && (
              <span className={classes.summary}>
                {summary || 'Имя и телеграм не указаны'}
              </span>
            )}
          </span>

          {saved && <span className={classes.saved}>Сохранено</span>}

          <motion.span
            className={classes.chevron}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: duration.base, ease }}
            aria-hidden
          >
            <ChevronDownIcon size={20} />
          </motion.span>
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            className={classes.body}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.base, ease }}
          >
            <form className={classes.form} onSubmit={save}>
              <Field label="Имя" name="name" value={name} onChange={setName} />
              <Field
                label="Telegram"
                name="telegram"
                placeholder="@username"
                value={telegram}
                onChange={setTelegram}
                hint="По нему сходятся заказы из телеграма с этим профилем"
              />

              <div className={classes.actions}>
                <Button type="submit" size="small" loading={isLoading}>
                  {saved ? 'Сохранено' : 'Сохранить'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

function activeLabel(count: number): string {
  const tail = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (!teen && tail === 1) return `${count} активная подписка`;
  if (!teen && tail >= 2 && tail <= 4) return `${count} активные подписки`;
  return `${count} активных подписок`;
}
