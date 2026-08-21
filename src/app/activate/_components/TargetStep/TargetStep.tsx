'use client';

import React, { FC } from 'react';

import { Button, Field, Notice } from '@/components/ui';
import type {
  ActivationDto,
  ServiceActivationDto,
  TargetOptionDto,
} from '@/store/api/types';
import { maskEmail } from '@/utils/helpers';

import classes from './TargetStep.module.scss';
import { AccountConfirmation } from './AccountConfirmation';
import { KindChooser } from './KindChooser';
import { useTargetStep } from './useTargetStep';
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
 *  карты — витрина не знает и не должна знать, кто это.
 *
 *  Проверка аккаунта и активация разделены намеренно. Между ними
 *  покупатель видит, на какой именно аккаунт уедет подписка, — а
 *  перепутанный аккаунт это ровно та ошибка, которую после активации уже
 *  не отменить. Если поставщик проверять не умеет, шаг схлопывается: не
 *  показываем пустое подтверждение ради симметрии.
 *
 *  Сам компонент только раскладывает экран. Порядок проверки живёт в
 *  `useTargetStep`, выбор способа и панель подтверждения — в соседних
 *  файлах: у них своя разметка, и правят их по разным поводам.
 */
export const TargetStep: FC<Props> = ({
  code,
  service,
  targets,
  onStarted,
}) => {
  const step = useTargetStep({ code, targets, onStarted });

  if (!step.option) {
    return (
      <Notice tone="error" title="Форма активации ещё не настроена">
        Напишите в поддержку — активируем ключ вручную.
      </Notice>
    );
  }

  const { option } = step;

  return (
    <form className={classes.step} onSubmit={step.check} noValidate>
      <Instruction
        text={service.instruction}
        url={option.how_to_url || service.instruction_url}
        urlLabel={option.how_to_label || service.instruction_url_label}
      />

      <KindChooser
        targets={targets}
        selected={option.kind}
        disabled={step.isBusy}
        onSelect={step.setKind}
      />

      <Field
        key={option.kind}
        name={option.kind}
        label={option.label}
        placeholder={option.placeholder}
        hint={option.hint}
        error={step.error}
        type={option.input === 'textarea' ? 'textarea' : 'text'}
        value={step.value}
        onChange={step.setValue}
        disabled={step.isBusy}
        rows={option.input === 'textarea' ? 8 : undefined}
        // Секреты и идентификаторы автозаменой только портятся.
        autoCapitalize="none"
        spellCheck={false}
        autoComplete="off"
      />

      {step.localEmail && !step.isConfirmed && (
        <p className={classes.preview}>
          Похоже, это аккаунт <strong>{maskEmail(step.localEmail)}</strong>.
          Проверим у поставщика.
        </p>
      )}

      {step.isConfirmed ? (
        <AccountConfirmation
          account={step.account}
          isUnchecked={step.isUnchecked}
          note={service.activation_note}
          isStarting={step.isStarting}
          onConfirm={step.confirm}
        />
      ) : (
        <Button
          type="submit"
          size="large"
          loading={step.isChecking}
          className={classes.button}
        >
          {service.submit_label || 'Проверить данные'}
        </Button>
      )}
    </form>
  );
};
