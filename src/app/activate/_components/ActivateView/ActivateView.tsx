'use client';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { KeyCode, Notice, Steps } from '@/components/ui';
import { KeyForm } from '@/components/units';
import { throttleMessage } from '@/store/api/errors';
import { useVerifyKeyMutation } from '@/store/api/k30Api';
import type { ActivationDto } from '@/store/api/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  activationRetried,
  activationUpdated,
  keyVerified,
  selectActivationFor,
} from '@/store/slices/activation';
import type { ActivationStepId } from '@/utils/consts';
import { Routes, SupportTelegram } from '@/utils/consts';
import { formatKey, isKeyComplete } from '@/utils/helpers';

import classes from './ActivateView.module.scss';
import { ActivationRules } from '../ActivationRules/ActivationRules';
import { ProgressStep } from '../ProgressStep/ProgressStep';
import { ResultStep } from '../ResultStep/ResultStep';
import { TargetStep } from '../TargetStep/TargetStep';

/** Страница активации: три шага и один источник правды.
 *
 *  Какой шаг показывать, определяет состояние активации с бэкенда, а не
 *  локальный флаг: вернуться сюда можно по ссылке из мессенджера, после
 *  перезагрузки или из второй вкладки, и во всех случаях страница обязана
 *  показать то, что происходит на самом деле, а не начать сначала.
 */
export const ActivateView: FC = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [verifyKey, { isLoading }] = useVerifyKeyMutation();

  // Код нормализуем так же, как в поле на главной: ссылку пересылают
  // в мессенджерах, и оттуда она приходит с чем угодно вокруг.
  const code = formatKey(params.get('key') ?? '');
  const cached = useAppSelector(selectActivationFor(code));

  const [error, setError] = useState('');

  // Для какого ключа правила уже приняты. Код, а не флаг: страницу
  // открывают со вторым ключом в той же вкладке, и согласие с правилами
  // одного сервиса не должно молча распространяться на другой.
  const [rulesAcceptedFor, setRulesAcceptedFor] = useState('');

  // Какой код уже спрашивали. Засов в ref, а не флаг в состоянии:
  // запрос меняет и `isLoading`, и стор, и любая подписка на них
  // перезапускала бы эффект, пока лимит на verify-key не отсечёт нас
  // с 429 — ровно это и происходило.
  const requested = useRef<string | null>(null);

  // Прямая ссылка или перезагрузка: стора нет, спрашиваем бэкенд сами.
  useEffect(() => {
    if (!code || cached || requested.current === code) return;
    requested.current = code;

    const load = async () => {
      if (!isKeyComplete(code)) {
        setError('Ссылка неполная — проверьте код ключа.');
        return;
      }

      try {
        const response = await verifyKey(code).unwrap();

        if (!response.success || !response.key || !response.service) {
          setError(response.error || 'Ключ не найден. Проверьте код.');
          return;
        }

        dispatch(
          keyVerified({
            code: response.key.code,
            service: response.service,
            key: response.key,
            targets: response.targets ?? [],
            canActivate: Boolean(response.can_activate),
            message: response.message ?? '',
            // Если по ключу уже что-то идёт, бэкенд пришлёт активацию
            // прямо здесь — и мы сразу откроем экран ожидания.
            activation: response.activation ?? null,
          }),
        );
      } catch (exception) {
        setError(
          throttleMessage(exception) ??
            'Не получилось связаться с сервером. Обновите страницу.',
        );
      }
    };

    void load();
  }, [code, cached, verifyKey, dispatch]);

  const onActivation = useCallback(
    (activation: ActivationDto) => dispatch(activationUpdated(activation)),
    [dispatch],
  );

  const onRetry = useCallback(() => {
    // Повтор начинается с той же формы, но данные вводятся заново:
    // прошлые мы у себя не держим, и это не оплошность — токен нужен
    // ровно на один запрос.
    dispatch(activationRetried());
  }, [dispatch]);

  const activation = cached?.activation ?? null;
  const step = currentStep(activation, cached?.canActivate);
  const isComplete = activation?.status === 'success';

  const rules = cached?.service?.activation_rules ?? '';
  const needsRules = Boolean(rules) && rulesAcceptedFor !== code;

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <header className={classes.header}>
          <h1 className={classes.title}>Активация подписки</h1>
          {cached?.key && (
            <p className={classes.subtitle}>
              {[cached.key.service, cached.key.plan].filter(Boolean).join(' ')}
            </p>
          )}
        </header>

        <Steps
          current={step}
          isComplete={isComplete}
          className={classes.steps}
        />

        {code && <KeyCode code={code} className={classes.key} />}

        <div className={classes.body}>
          {!code && (
            <div className={classes.prompt}>
              <p className={classes.prompt_text}>
                Введите код из письма — проверим его и откроем активацию.
              </p>
              <KeyForm />
            </div>
          )}

          {error && (
            <Notice tone="error" title="Не получилось открыть активацию">
              {error}
            </Notice>
          )}

          {isLoading && !cached && (
            <p className={classes.loading}>Проверяем ключ…</p>
          )}

          {/* Ключ найден, но активировать нельзя: уже активирован или
              поставщик отказал. Причину присылает бэкенд. */}
          {cached && !cached.canActivate && !activation && (
            <Notice tone="error" title="Активация недоступна">
              {cached.message || 'Напишите в поддержку — разберёмся.'}
            </Notice>
          )}

          {/* Форма не рендерится, пока правила не приняты: окно поверх
              неё покупатель закрыть не может, но и подсматривать поля
              под ним незачем. */}
          {cached?.service &&
            cached.canActivate &&
            !activation &&
            (needsRules ? (
              <ActivationRules
                serviceName={cached.service.name}
                rules={rules}
                onAccept={() => setRulesAcceptedFor(code)}
              />
            ) : (
              <TargetStep
                code={code}
                service={cached.service}
                targets={cached.targets}
                onStarted={onActivation}
              />
            ))}

          {activation && isRunning(activation) && (
            <ProgressStep activation={activation} onUpdate={onActivation} />
          )}

          {activation && !isRunning(activation) && (
            <ResultStep
              activation={activation}
              service={cached?.service ?? undefined}
              onRetry={onRetry}
            />
          )}

          <p className={classes.support}>
            Что-то пошло не так?{' '}
            <a
              href={SupportTelegram}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.support_link}
            >
              Напишите в поддержку
            </a>{' '}
            и приложите код ключа.
          </p>

          {!cached && !error && !isLoading && code && (
            <a className={classes.support_link} href={Routes.Home}>
              Вернуться на главную
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

function isRunning(activation: ActivationDto): boolean {
  return activation.status === 'pending' || activation.status === 'processing';
}

function currentStep(
  activation: ActivationDto | null,
  canActivate?: boolean,
): ActivationStepId {
  if (!activation) return canActivate ? 'account' : 'key';
  // Законченная активация — тот же третий шаг, только закрытый:
  // успех отмечает галочкой `isComplete`, отказ оставляет шаг текущим,
  // потому что с него ещё можно повторить попытку.
  return 'progress';
}
