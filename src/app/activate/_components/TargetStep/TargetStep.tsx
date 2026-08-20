'use client';

import React, { FC, FormEvent, useMemo, useState } from 'react';

import { Button, Field, Notice, UserIcon } from '@/components/ui';
import { throttleMessage } from '@/store/api/errors';
import {
  useActivateMutation,
  useCheckAccountMutation,
} from '@/store/api/k30Api';
import type {
  AccountDto,
  ActivationDto,
  ServiceActivationDto,
  TargetOptionDto,
} from '@/store/api/types';
import {
  maskEmail,
  normalizeTarget,
  previewEmail,
  validateTarget,
} from '@/utils/helpers';

import classes from './TargetStep.module.scss';
import { Instruction } from '../Instruction/Instruction';

interface Props {
  code: string;
  service: ServiceActivationDto;
  /** Что просит поставщик. Первый вариант — рекомендованный. */
  targets: TargetOptionDto[];
  onStarted: (activation: ActivationDto) => void;
}

/** Шаг «Аккаунт»: куда выдать подписку.
 *
 *  Состав формы приходит с бэкенда и зависит от поставщика конкретной
 *  карты — витрина не знает и не должна знать, кто это. Когда вариантов
 *  несколько (у ChatGPT это JSON сессии либо один account_id), даём
 *  выбрать: достать проще то одно, то другое.
 *
 *  Проверка аккаунта и активация разделены намеренно. Между ними
 *  покупатель видит, на какой именно аккаунт уедет подписка, — а
 *  перепутанный аккаунт это ровно та ошибка, которую после активации уже
 *  не отменить. Если поставщик проверять не умеет, шаг схлопывается: не
 *  показываем пустое подтверждение ради симметрии.
 */
export const TargetStep: FC<Props> = ({ code, service, targets, onStarted }) => {
  const [checkAccount, { isLoading: isChecking }] = useCheckAccountMutation();
  const [activate, { isLoading: isStarting }] = useActivateMutation();

  const [kind, setKind] = useState(targets[0]?.kind);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [account, setAccount] = useState<AccountDto | null>(null);
  /** Поставщик проверять не умеет — подтверждаем тем, что видно локально. */
  const [unchecked, setUnchecked] = useState(false);

  const option = useMemo(
    () => targets.find((item) => item.kind === kind) ?? targets[0],
    [targets, kind],
  );

  const busy = isChecking || isStarting;

  const reset = () => {
    setError('');
    setAccount(null);
    setUnchecked(false);
  };

  const onValue = (next: string) => {
    setValue(next);
    // Данные поменяли — прежняя проверка больше ни о чём не говорит.
    reset();
  };

  const onKind = (next: typeof kind) => {
    setKind(next);
    setValue('');
    reset();
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

      if (!response.supported) {
        setUnchecked(true);
        setAccount(response.account);
        return;
      }
      if (!response.success || !response.account) {
        setError(response.error || 'Проверка не прошла. Попробуйте ещё раз.');
        return;
      }
      setAccount(response.account);
    } catch (exception) {
      setError(
        throttleMessage(exception) ??
          'Не получилось связаться с сервером. Попробуйте ещё раз.',
      );
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
      onStarted(response.activation);
    } catch (exception) {
      setError(
        throttleMessage(exception) ??
          'Не получилось связаться с сервером. Попробуйте ещё раз.',
      );
    }
  };

  if (!option) {
    return (
      <Notice tone="error" title="Форма активации ещё не настроена">
        Напишите в поддержку — активируем ключ вручную.
      </Notice>
    );
  }

  // Почта, вытащенная из самого токена. Показываем сразу, не дожидаясь
  // ответа: это ровно то, что покупателю нужно проверить.
  const local = previewEmail(option.kind, value);
  const confirmed = account || unchecked;

  return (
    <form className={classes.step} onSubmit={check} noValidate>
      <Instruction
        text={service.instruction}
        url={option.how_to_url || service.instruction_url}
        urlLabel={option.how_to_label || service.instruction_url_label}
      />

      {targets.length > 1 && (
        <fieldset className={classes.choice} disabled={busy}>
          <legend className={classes.choice_title}>
            Чем подтвердить аккаунт
          </legend>

          <div className={classes.choice_options}>
            {targets.map((item) => (
              <label
                key={item.kind}
                className={classes.choice_option}
                data-selected={item.kind === option.kind}
              >
                <input
                  type="radio"
                  name="target-kind"
                  value={item.kind}
                  checked={item.kind === option.kind}
                  onChange={() => onKind(item.kind)}
                  className={classes.choice_input}
                />
                <span className={classes.choice_label}>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <Field
        key={option.kind}
        name={option.kind}
        label={option.label}
        placeholder={option.placeholder}
        hint={option.hint}
        error={error}
        type={option.input === 'textarea' ? 'textarea' : 'text'}
        value={value}
        onChange={onValue}
        disabled={busy}
        rows={option.input === 'textarea' ? 8 : undefined}
        // Секреты и идентификаторы автозаменой только портятся.
        autoCapitalize="none"
        spellCheck={false}
        autoComplete="off"
      />

      {local && !confirmed && (
        <p className={classes.preview}>
          Похоже, это аккаунт <strong>{maskEmail(local)}</strong>. Проверим
          у поставщика.
        </p>
      )}

      {confirmed ? (
        <div className={classes.account}>
          <Notice
            tone={unchecked ? 'info' : 'success'}
            title={
              unchecked ? 'Проверьте аккаунт сами' : 'Аккаунт подтверждён'
            }
          >
            {unchecked ? (
              <>
                Этот поставщик не умеет проверять аккаунт заранее.
                {account?.email ? (
                  <>
                    {' '}
                    По данным видно аккаунт <strong>{account.email}</strong>.
                  </>
                ) : null}{' '}
                Убедитесь, что данные из того аккаунта, куда нужна подписка, —
                после активации это уже не отменить.
              </>
            ) : (
              <>
                Подписка уедет на <strong>{account?.email}</strong>. Если это
                не тот аккаунт — измените данные выше.
              </>
            )}
          </Notice>

          {Boolean(account?.subscriptions?.length) && (
            <Notice tone="info" title="На аккаунте уже есть подписка">
              <ul className={classes.subscriptions}>
                {account?.subscriptions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              Поставщики обычно не начисляют поверх действующей подписки —
              проверьте, точно ли нужен этот аккаунт.
            </Notice>
          )}

          {service.activation_note && (
            <p className={classes.note}>{service.activation_note}</p>
          )}

          <div className={classes.actions}>
            {account?.email && (
              <span className={classes.user}>
                <UserIcon size={18} />
                {account.email}
              </span>
            )}
            <Button
              type="button"
              size="large"
              onClick={confirm}
              loading={isStarting}
            >
              Подтвердить и активировать
            </Button>
          </div>
        </div>
      ) : (
        <Button type="submit" size="large" loading={isChecking} className={classes.button}>
          {service.submit_label || 'Проверить данные'}
        </Button>
      )}
    </form>
  );
};
