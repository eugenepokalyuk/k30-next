'use client';

import React, { FC } from 'react';

import type { TargetOptionDto } from '@/store/api/types';

import classes from './TargetStep.module.scss';

interface Props {
  targets: TargetOptionDto[];
  selected: TargetOptionDto['kind'];
  disabled: boolean;
  onSelect: (kind: TargetOptionDto['kind']) => void;
}

/** Выбор того, чем покупатель подтвердит аккаунт.
 *
 *  Показывается, только когда вариантов правда несколько — у ChatGPT это
 *  JSON сессии либо account_id, и достать проще то одно, то другое.
 *  Единственный вариант рисовать переключателем незачем: выбор из одного
 *  пункта только сбивает с толку.
 */
export const KindChooser: FC<Props> = ({
  targets,
  selected,
  disabled,
  onSelect,
}) => {
  if (targets.length < 2) return null;

  return (
    <fieldset className={classes.choice} disabled={disabled}>
      <legend className={classes.choice_title}>Чем подтвердить аккаунт</legend>

      <div className={classes.choice_options}>
        {targets.map((item) => (
          <label
            key={item.kind}
            className={classes.choice_option}
            data-selected={item.kind === selected}
          >
            <input
              type="radio"
              name="target-kind"
              value={item.kind}
              checked={item.kind === selected}
              onChange={() => onSelect(item.kind)}
              className={classes.choice_input}
            />
            <span className={classes.choice_label}>{item.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
