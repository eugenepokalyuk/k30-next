'use client';

import { FormEvent, useMemo, useState } from 'react';

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

/** Список закрыт бэкендом: опечатка должна ломать сборку, а не
 *  активацию у покупателя. */
type TargetKind = TargetOptionDto['kind'];

/** Запасной текст: связи нет и сказать по существу нечего.
 *
 *  Именно запасной. Бэкенд любой отказ по существу отдаёт с кодом 200 и
 *  человеческим текстом, поэтому сначала пробуем показать его
 *  (`apiErrorMessage`), а «не получилось связаться» оставляем на случай,
 *  когда тела ответа нет вовсе: сеть, CORS, убитый воркер. Раньше этот
 *  текст стоял на всех исключениях подряд и подменял собой настоящую
 *  причину — покупатель жал «ещё раз», хотя ключ был уже потрачен. */
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
  /** Поставщик не умеет проверять — подтверждаем тем, что видно локально. */
  isUnchecked: boolean;
  isConfirmed: boolean;
  /** Почта, вытащенная из самого токена, — до похода к поставщику. */
  localEmail: string;
  isChecking: boolean;
  isStarting: boolean;
  isBusy: boolean;
  setValue: (next: string) => void;
  setKind: (next: TargetKind) => void;
  check: (event: FormEvent) => void;
  confirm: () => void;
}

/** Состояние шага «Аккаунт»: два запроса и то, что между ними.
 *
 *  Инвариант: подтверждение всегда относится к тем данным, которые
 *  сейчас в поле. Любое изменение ввода сбрасывает результат проверки —
 *  иначе покупатель подтвердит один аккаунт, поправит строку и
 *  активирует на другой, а это после активации уже не отменить.
 */
export function useTargetStep({
  code,
  targets,
  onStarted,
}: Params): TargetStepState {
  const [checkAccount, { isLoading: isChecking }] = useCheckAccountMutation();
  const [activate, { isLoading: isStarting }] = useActivateMutation();

  const [kind, setKind] = useState(targets[0]?.kind);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [account, setAccount] = useState<AccountDto | null>(null);
  const [isUnchecked, setUnchecked] = useState(false);

  const option = useMemo(
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
    // Данные поменяли — прежняя проверка больше ни о чём не говорит.
    resetCheck();
  };

  const changeKind = (next: TargetKind) => {
    setKind(next);
    setValue('');
    resetCheck();
  };

  const check = async (event: FormEvent) => {
    event.preventDefault();
    if (!option) return;

    // Проверяем формат на месте: у поставщиков жёсткие лимиты, и тратить
    // их на опечатки нельзя — вернётся 429 вместо подсказки.
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

      // `success` — первым. Отказ по существу приезжает без остальных
      // полей, и `supported: undefined` читался как «поставщик не умеет
      // проверять»: покупателю показывали мягкое «проверить заранее не
      // получилось» и кнопку «Подтвердить и активировать» — вместо того,
      // чтобы сказать, что с данными не так.
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

      // Отказ на запуске — тоже активация со статусом failed: экран
      // результата покажет её причину и подскажет, что делать дальше.
      //
      // Но не всякий отказ доходит до задачи. «Ключ уже активирован»,
      // «карта использована», «формат не тот» — это отказ *до* неё, и
      // активации в ответе нет вовсе. Раньше сюда уезжал `undefined`, и
      // экран результата открывался пустым, ничего не объяснив.
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
