'use client';

import React, { FC, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Field, Notice, TelegramIcon } from '@/components/ui';
import { AuthCard } from '@/components/units';
import { useEmailLogin, useSiteSettings, useTelegramLogin } from '@/lib/hooks';
import { useAuthOptionsQuery } from '@/store/api/k30Api';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthorized } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';

import classes from './LoginView.module.scss';

/**
 * Вход: код на почту и подтверждение в телеграм-боте.
 *
 * Пароля у покупателя нет вовсе: он приходит с Яндекс Маркета или из
 * телеграма, ничего не придумывал и через месяц всё равно жал бы
 * «восстановить».
 *
 * Оба способа показываются только когда их есть чем обслужить: без SMTP
 * код входа печатается в журнал сервера, без токена бота подтверждать
 * вход некому. Форма, которая заведомо не сработает, хуже её
 * отсутствия — человек ждёт письмо, которого не будет.
 *
 * Диплинк в бота, а не штатный Login Widget телеграма: виджету нужен
 * домен, привязанный в BotFather, а витрина живёт на GitHub Pages.
 */
export const LoginView: FC = () => {
  const router = useRouter();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const site = useSiteSettings();

  const { data: options, isLoading: isOptionsLoading } = useAuthOptionsQuery();
  const telegram = useTelegramLogin();
  const mail = useEmailLogin();

  // Один переход на три случая: вошедший вернулся сюда кнопкой «назад»,
  // подтверждение поймал опрос бота, код из письма подошёл — в каждом
  // кабинет уже доступен, и держать человека на форме входа незачем.
  useEffect(() => {
    if (isAuthorized) router.replace(Routes.Account);
  }, [isAuthorized, router]);

  const byEmail = Boolean(options?.email_login_enabled);
  const byTelegram = options ? options.telegram_login_enabled : true;
  const isLoginDisabled = Boolean(options) && !byEmail && !byTelegram;
  const supportUrl = options?.telegram_support_url || site.telegram_support_url;

  const submitEmail = (event: FormEvent) => {
    event.preventDefault();
    if (mail.stage === 'email') void mail.requestCode();
    else void mail.verify();
  };

  return (
    <AuthCard
      title="Вход"
      description="Кабинет показывает ваши покупки и статусы активации. Активировать ключ можно и без входа."
      footer={
        <>
          Не получается войти?{' '}
          <a
            className={classes.link}
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать в поддержку
          </a>
        </>
      }
    >
      <div className={classes.form}>
        {isLoginDisabled && (
          <Notice tone="error" title="Вход временно недоступен">
            Ни почта, ни бот сейчас не настроены — войти в кабинет нечем.
            Напишите в поддержку: ключ активируется и без кабинета.
          </Notice>
        )}

        {byEmail && (
          <form className={classes.form} onSubmit={submitEmail} noValidate>
            {mail.error && <Notice tone="error">{mail.error}</Notice>}

            {mail.stage === 'email' ? (
              <>
                <Field
                  label="Почта"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  enterKeyHint="send"
                  value={mail.email}
                  onChange={mail.setEmail}
                  hint="Пришлём код — пароль придумывать не нужно."
                />
                <Button type="submit" fullWidth loading={mail.isSending}>
                  Получить код
                </Button>
              </>
            ) : (
              <>
                {mail.sent && <Notice tone="info">{mail.sent}</Notice>}

                <Field
                  label="Код из письма"
                  name="code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  autoCapitalize="characters"
                  spellCheck={false}
                  enterKeyHint="go"
                  placeholder="000000"
                  value={mail.code}
                  onChange={mail.setCode}
                />

                <Button type="submit" fullWidth loading={mail.isVerifying}>
                  Войти
                </Button>

                <div className={classes.secondary}>
                  {/* Не ссылка, а кнопка: обе меняют состояние формы, а
                      не адрес страницы. */}
                  <button
                    type="button"
                    className={classes.plain}
                    onClick={mail.changeEmail}
                  >
                    Другая почта
                  </button>
                  <button
                    type="button"
                    className={classes.plain}
                    onClick={() => void mail.requestCode()}
                    disabled={mail.resendIn > 0 || mail.isSending}
                  >
                    {mail.resendIn > 0
                      ? `Отправить ещё раз через ${mail.resendIn} с`
                      : 'Отправить ещё раз'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {byEmail && byTelegram && <div className={classes.divider}>или</div>}

        {byTelegram && (
          <>
            {telegram.error && <Notice tone="error">{telegram.error}</Notice>}

            {telegram.stage === 'needs_email' && (
              <Notice tone="info" title="Бот ждёт вашу почту">
                Допишите её в чате с ботом — после этого вход продолжится
                сам, страницу закрывать не нужно.
              </Notice>
            )}

            {telegram.stage === 'waiting' && (
              <Notice tone="info" title="Ждём подтверждения в телеграме">
                Откройте чат с ботом и нажмите «Запустить». Эта страница
                поймает подтверждение сама.
              </Notice>
            )}

            {telegram.link ? (
              // Кнопка ведёт на ту же заявку: если вкладку с телеграмом
              // закрыли или её съел блокировщик, второй попытке не нужен
              // новый nonce — старый ещё жив.
              <Button
                fullWidth
                href={telegram.link.url}
                external
                variant="outlined"
              >
                <TelegramIcon size={18} />
                Открыть бота ещё раз
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={telegram.start}
                loading={telegram.isStarting || isOptionsLoading}
                variant={byEmail ? 'outlined' : 'filled'}
              >
                <TelegramIcon size={18} />
                Войти через телеграм
              </Button>
            )}
          </>
        )}
      </div>
    </AuthCard>
  );
};
