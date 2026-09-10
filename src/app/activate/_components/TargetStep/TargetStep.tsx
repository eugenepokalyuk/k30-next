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
import { AccountBar } from './AccountBar';
import { AccountConfirmation } from './AccountConfirmation';
import { KindChooser } from './KindChooser';
import { TargetExample } from './TargetExample';
import { useTargetStep } from './useTargetStep';
import { Instruction } from '../Instruction/Instruction';

interface Props {
  code: string;
  service: ServiceActivationDto;
  targets: TargetOptionDto[];
  onStarted: (activation: ActivationDto) => void;
}

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
        serviceName={service.name}
        serviceUrl={service.source_url}
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
        autoCapitalize="none"
        spellCheck={false}
        autoComplete="off"
      />

      <TargetExample
        image={option.example_image || service.example_image || ''}
        caption={option.example_caption || service.example_caption}
        label={option.label}
        isOwn={Boolean(option.example_image)}
      />

      {step.isConfirmed ? (
        <AccountConfirmation
          note={service.activation_note}
          email={maskEmail(step.account?.email || step.localEmail)}
          isStarting={step.isStarting}
          onConfirm={step.confirm}
        />
      ) : (
        <AccountBar email={maskEmail(step.localEmail)}>
          <Button
            type="submit"
            size="large"
            loading={step.isChecking}
            className={classes.button}
            fullWidth={!step.localEmail}
          >
            {service.submit_label || 'Проверить данные'}
          </Button>
        </AccountBar>
      )}
    </form>
  );
};
