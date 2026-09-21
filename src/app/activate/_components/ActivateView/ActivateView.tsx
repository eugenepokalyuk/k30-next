'use client';

import React, { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { Notice, ServiceMark, Steps } from '@/components/ui';
import { apiErrorMessage } from '@/store/api/errors';
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
import { KeySection, type KeyStatus } from '../KeySection/KeySection';
import { ProgressStep } from '../ProgressStep/ProgressStep';
import { ResultStep } from '../ResultStep/ResultStep';
import { TargetStep } from '../TargetStep/TargetStep';

export const ActivateView: FC = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [verifyKey, { isLoading }] = useVerifyKeyMutation();

  const code = formatKey(params.get('key') ?? '');
  const cached = useAppSelector(selectActivationFor(code));

  const [error, setError] = React.useState('');

  const [rulesAcceptedFor, setRulesAcceptedFor] = React.useState('');

  const requested = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!code || cached || requested.current === code) return;
    requested.current = code;

    const load = async () => {
      if (!isKeyComplete(code)) {
        setError('Ссылка неполная — проверьте код ключа');
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
            activation: response.activation ?? null,
          }),
        );
      } catch (exception) {
        setError(
          apiErrorMessage(
            exception,
            'Не получилось связаться с сервером. Обновите страницу.',
          ),
        );
      }
    };

    void load();
  }, [code, cached, verifyKey]);

  const onActivation = React.useCallback(
    (activation: ActivationDto) => dispatch(activationUpdated(activation)),
    [],
  );

  const onRetry = React.useCallback(() => {
    dispatch(activationRetried());
  }, []);

  const activation = cached?.activation ?? null;
  const step = currentStep(activation, cached?.canActivate);
  const isComplete = activation?.status === 'success';
  const keyStatus = currentKeyStatus(cached, activation);

  const rules = cached?.service?.activation_rules ?? '';
  const ruleBlocks = cached?.service?.rule_blocks ?? [];
  const needsRules =
    Boolean(rules || ruleBlocks.length) && rulesAcceptedFor !== code;

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <header className={classes.header}>
          <h1 className={classes.title}>Активация подписки</h1>
          {cached?.key && (
            <p className={classes.subtitle}>
              <ServiceMark
                logo={cached.service?.logo ?? null}
                accentColor={cached.service?.accent_color}
                size={28}
                className={classes.subtitle_logo}
              />
              {[cached.key.service, cached.key.plan].filter(Boolean).join(' ')}
            </p>
          )}
        </header>

        <Steps
          current={step}
          isComplete={isComplete}
          className={classes.steps}
        />

        {!isComplete && (
          <KeySection
            code={code}
            status={keyStatus}
            message={keyStatus === 'rejected' ? cached?.message : ''}
            className={classes.key}
          />
        )}

        <div className={classes.body}>
          {error && (
            <Notice tone="error" title="Не получилось открыть активацию">
              {error}
            </Notice>
          )}

          {isLoading && !cached && (
            <p className={classes.loading}>Проверяем ключ…</p>
          )}

          {cached?.service &&
            cached.canActivate &&
            !activation &&
            (needsRules ? (
              <ActivationRules
                serviceName={cached.service.name}
                logo={cached.service.logo}
                accentColor={cached.service.accent_color}
                rules={rules}
                ruleBlocks={ruleBlocks}
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
            и приложите код ключа
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

  return 'progress';
}

function currentKeyStatus(
  cached: { canActivate: boolean; message: string } | null,
  activation: ActivationDto | null,
): KeyStatus {
  if (activation) return 'accepted';
  if (!cached) return 'waiting';
  if (cached.canActivate) return 'accepted';
  return cached.message ? 'rejected' : 'waiting';
}
