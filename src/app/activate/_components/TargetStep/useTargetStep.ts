'use client';

import React from 'react';

import { apiErrorMessage } from '@/store/api/errors';
import {
  useActivateMutation,
  useCheckAccountMutation,
} from '@/store/api/k30Api';
import type {
  AccountDto,
  ActivationDto,
  TargetOptionDto,
} from '@/store/api/types';
import { normalizeTarget, previewEmail, validateTarget } from '@/utils/helpers';

type TargetKind = TargetOptionDto['kind'];

const NETWORK_ERROR = 'Не получилось связаться с сервером. Попробуйте ещё раз.';

interface Params {
  code: string;
  targets: TargetOptionDto[];
  onStarted: (activation: ActivationDto) => void;
}

export interface TargetStepState {
  option: TargetOptionDto | undefined;
  value: string;
  error: string;
  account: AccountDto | null;
  isUnchecked: boolean;
  isConfirmed: boolean;
  localEmail: string;
  isChecking: boolean;
  isStarting: boolean;
  isBusy: boolean;
  setValue: (next: string) => void;
  setKind: (next: TargetKind) => void;
  check: (event: React.FormEvent) => void;
  confirm: () => void;
}

export function useTargetStep({
  code,
  targets,
  onStarted,
}: Params): TargetStepState {
  const [checkAccount, { isLoading: isChecking }] = useCheckAccountMutation();
  const [activate, { isLoading: isStarting }] = useActivateMutation();

  const [kind, setKind] = React.useState(targets[0]?.kind);
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');
  const [account, setAccount] = React.useState<AccountDto | null>(null);
  const [isUnchecked, setUnchecked] = React.useState(false);

  const option = React.useMemo(
    () => targets.find((item) => item.kind === kind) ?? targets[0],
    [targets, kind],
  );

  const resetCheck = () => {
    setError('');
    setAccount(null);
    setUnchecked(false);
  };

  const changeValue = (next: string) => {
    setValue(next);
    resetCheck();
  };

  const changeKind = (next: TargetKind) => {
    setKind(next);
    setValue('');
    resetCheck();
  };

  const check = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!option) return;

    const complaint = validateTarget(option.kind, value);
    if (complaint) {
      setError(complaint);
      return;
    }
    setError('');

    try {
      const response = await checkAccount({
        key: code,
        kind: option.kind,
        value: normalizeTarget(option.kind, value),
      }).unwrap();

      if (!response.success) {
        setError(response.error || 'Проверка не прошла. Попробуйте ещё раз.');
        return;
      }
      if (!response.supported) {
        setUnchecked(true);
        setAccount(response.account ?? null);
        return;
      }
      if (!response.account) {
        setError(response.error || 'Проверка не прошла. Попробуйте ещё раз.');
        return;
      }
      setAccount(response.account);
    } catch (exception) {
      setError(apiErrorMessage(exception, NETWORK_ERROR));
    }
  };

  const confirm = async () => {
    if (!option) return;
    setError('');

    try {
      const response = await activate({
        key: code,
        kind: option.kind,
        value: normalizeTarget(option.kind, value),
      }).unwrap();

      if (!response.activation) {
        setError(
          response.error ||
            'Не получилось запустить активацию. Напишите в поддержку.',
        );
        return;
      }
      onStarted(response.activation);
    } catch (exception) {
      setError(apiErrorMessage(exception, NETWORK_ERROR));
    }
  };

  return {
    option,
    value,
    error,
    account,
    isUnchecked,
    isConfirmed: Boolean(account) || isUnchecked,
    localEmail: option ? previewEmail(option.kind, value) : '',
    isChecking,
    isStarting,
    isBusy: isChecking || isStarting,
    setValue: changeValue,
    setKind: changeKind,
    check,
    confirm,
  };
}
