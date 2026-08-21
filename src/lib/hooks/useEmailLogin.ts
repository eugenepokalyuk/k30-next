'use client';

import { useEffect, useState } from 'react';

import { apiErrorMessage } from '@/store/api/errors';
import {
  useRequestEmailCodeMutation,
  useVerifyEmailCodeMutation,
} from '@/store/api/k30Api';

/** Пауза между письмами. У ручки входа свой лимит на бэкенде, и без
 *  паузы человек упирается в 429 вместо второго письма — «отправить
 *  ещё раз» должна становиться доступной сама, а не по ошибке. */
const RESEND_SECONDS = 60;

/** Что показывает форма: адрес ещё спрашиваем или уже ждём код. */
export type EmailLoginStage = 'email' | 'code';

interface Result {
  stage: EmailLoginStage;
  email: string;
  setEmail: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  /** Текст бэкенда о том, куда ушло письмо и сколько живёт код. */
  sent: string;
  error: string;
  isSending: boolean;
  isVerifying: boolean;
  /** Сколько секунд до «отправить ещё раз». Ноль — можно сейчас. */
  resendIn: number;
  requestCode: () => Promise<void>;
  verify: () => Promise<void>;
  /** Вернуться к адресу: опечатались в почте и ждать код смысла нет. */
  changeEmail: () => void;
}

/**
 * Вход по коду на почту: запросить письмо и ввести код из него.
 *
 * Момент «вошли» здесь не обрабатывается — токены кладёт в стор сам
 * эндпоинт (см. `onQueryStarted` в k30Api), как и у входа через бота.
 * Хук отвечает только за то, что видно на экране.
 */
export function useEmailLogin(): Result {
  const [requestEmailCode, { isLoading: isSending }] =
    useRequestEmailCodeMutation();
  const [verifyEmailCode, { isLoading: isVerifying }] =
    useVerifyEmailCodeMutation();

  const [stage, setStage] = useState<EmailLoginStage>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);

  // Отсчёт до следующего письма. Секунда — самый крупный шаг, при
  // котором подпись на кнопке не выглядит зависшей.
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const requestCode = async () => {
    setError('');

    const address = email.trim();
    if (!address) {
      setError('Введите почту, на неё придёт код.');
      return;
    }

    try {
      const answer = await requestEmailCode(address).unwrap();
      setEmail(address);
      setSent(answer.detail);
      setStage('code');
      setResendIn(RESEND_SECONDS);
      // Код от прошлой попытки в поле больше не годится: письмо новое,
      // а старый код бэкенд уже погасил.
      setCode('');
    } catch (exception) {
      setError(
        apiErrorMessage(
          exception,
          'Не получилось отправить код. Попробуйте ещё раз или войдите через телеграм.',
        ),
      );
    }
  };

  const verify = async () => {
    setError('');

    if (!code.trim()) {
      setError('Введите код из письма.');
      return;
    }

    try {
      await verifyEmailCode({ email, code: code.trim() }).unwrap();
    } catch (exception) {
      setError(
        apiErrorMessage(
          exception,
          'Не получилось проверить код. Попробуйте ещё раз или напишите в поддержку.',
        ),
      );
    }
  };

  const changeEmail = () => {
    setStage('email');
    setSent('');
    setError('');
    setCode('');
    // Отсчёт не сбрасываем: лимит на бэкенде живёт по адресу и времени,
    // а не по тому, что мы вернулись на шаг назад.
  };

  return {
    stage,
    email,
    setEmail,
    code,
    setCode,
    sent,
    error,
    isSending,
    isVerifying,
    resendIn,
    requestCode,
    verify,
    changeEmail,
  };
}
