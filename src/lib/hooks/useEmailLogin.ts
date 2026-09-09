'use client';

import React from 'react';

import { apiErrorMessage } from '@/store/api/errors';
import {
  useRequestEmailCodeMutation,
  useVerifyEmailCodeMutation,
} from '@/store/api/k30Api';

const RESEND_SECONDS = 60;

export type EmailLoginStage = 'email' | 'code';

interface Result {
  stage: EmailLoginStage;
  email: string;
  setEmail: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  sent: string;
  error: string;
  isSending: boolean;
  isVerifying: boolean;
  resendIn: number;
  requestCode: () => Promise<void>;
  verify: () => Promise<void>;
  changeEmail: () => void;
}

export function useEmailLogin(): Result {
  const [requestEmailCode, { isLoading: isSending }] = useRequestEmailCodeMutation();
  const [verifyEmailCode, { isLoading: isVerifying }] = useVerifyEmailCodeMutation();

  const [stage, setStage] = React.useState<EmailLoginStage>('email');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [sent, setSent] = React.useState('');
  const [error, setError] = React.useState('');
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
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
