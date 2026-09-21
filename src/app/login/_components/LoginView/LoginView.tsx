'use client';

import React, { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Field, Notice, TelegramIcon } from '@/components/ui';
import { AuthCard, TelegramEmailForm } from '@/components/units';
import { useEmailLogin, useSiteSettings, useTelegramLogin } from '@/lib/hooks';
import {
  useAuthOptionsQuery,
  useTelegramWebAppLoginMutation,
} from '@/store/api/k30Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthorized } from '@/store/slices/auth';
import {
  selectIsMiniApp,
  selectTelegram,
  selectWebAppAuth,
  webAppAuthFailed,
  webAppAuthStarted,
  webAppNeedsEmail,
  webAppSignedIn,
} from '@/store/slices/telegram';
import { Routes } from '@/utils/consts';

import classes from './LoginView.module.scss';

export const LoginView: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const site = useSiteSettings();

  const next = useSearchParams().get('next') ?? '';
  const backTo = next.startsWith('/') && !next.startsWith('//')
    ? next
    : Routes.Account;

  const { data: options, isLoading: isOptionsLoading } = useAuthOptionsQuery();
  const telegram = useTelegramLogin();
  const mail = useEmailLogin();

  React.useEffect(() => {
    if (isAuthorized) router.replace(backTo);
  }, [backTo, isAuthorized, router]);

  const isMiniApp = useAppSelector(selectIsMiniApp);
  const webAppAuth = useAppSelector(selectWebAppAuth);
  const { initData, error: webAppError } = useAppSelector(selectTelegram);

  const [webAppLogin, { isLoading: isWebAppLogging }] =
    useTelegramWebAppLoginMutation();

  const retryWebApp = async () => {
    if (!initData) return;
    dispatch(webAppAuthStarted());

    try {
      const result = await webAppLogin({ init_data: initData }).unwrap();
      if (result.status === 'needs_email') dispatch(webAppNeedsEmail());
      else dispatch(webAppSignedIn());
    } catch {
      dispatch(
        webAppAuthFailed(
          'Telegram снова не ответил. Попробуйте ещё раз или войдите по почте.',
        ),
      );
    }
  };

  const byEmail = Boolean(options?.email_login_enabled);
  const byTelegram =
    (options ? options.telegram_login_enabled : true) && !isMiniApp;
  const isLoginDisabled = Boolean(options) && !byEmail && !byTelegram;
  const supportUrl = options?.telegram_support_url || site.telegram_support_url;

  const submitEmail = (event: React.FormEvent) => {
    event.preventDefault();
    if (mail.stage === 'email') void mail.requestCode();
    else void mail.verify();
  };

  if (isMiniApp && webAppAuth === 'needs_email') {
    return (
      <AuthCard
        title="Почти готово"
        description="Мы узнали вас по Telegram. Остался адрес почты — на него придут ключ и чек."
      >
        <TelegramEmailForm />
      </AuthCard>
    );
  }

  if (isMiniApp && webAppAuth === 'signing_in') {
    return (
      <AuthCard title="Входим" description="Узнаём вас по Telegram — секунду." />
    );
  }

  if (isMiniApp && webAppAuth === 'failed') {
    return (
      <AuthCard
        title="Вход через Telegram не прошёл"
        description="Попробуем ещё раз — из приложения выходить не нужно."
      >
        <div className={classes.form}>
          <Notice tone="error">{webAppError}</Notice>

          <Button fullWidth onClick={retryWebApp} loading={isWebAppLogging}>
            <TelegramIcon size={18} />
            Попробовать ещё раз
          </Button>
        </div>
      </AuthCard>
    );
  }

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
                Допишите её в чате с ботом — после этого вход продолжится сам,
                страницу закрывать не нужно.
              </Notice>
            )}

            {telegram.stage === 'needs_code' && (
              <Notice tone="info" title="Бот ждёт код из письма">
                Мы отправили код на указанную почту — пришлите его в чат боту.
                Без этого шага к кабинету можно было бы привязать чужой адрес.
              </Notice>
            )}

            {telegram.stage === 'waiting' && (
              <Notice tone="info" title="Ждём подтверждения в телеграме">
                Откройте чат с ботом и нажмите «Запустить». Эта страница поймает
                подтверждение сама.
              </Notice>
            )}

            {telegram.link ? (
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
