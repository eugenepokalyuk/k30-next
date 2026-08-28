'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { type ActivationStepId, ActivationSteps } from '@/utils/consts';

import classes from './Steps.module.scss';
import { CheckIcon } from '../Icons/Icons';

interface Props {
  current: ActivationStepId;
  /** Подписка выдана: последний шаг закрывается галочкой, текущего нет.
   *  Отдельного шага «Готово» в треке нет — есть завершённый третий. */
  isComplete?: boolean;
  className?: string;
}

/** Трек-трейс активации: где покупатель сейчас и что впереди. Состав
 *  шагов — в константах, добавить шаг можно правкой одних их. */
export const Steps: FC<Props> = ({ current, isComplete, className }) => {
  const currentIndex = ActivationSteps.findIndex((step) => step.id === current);

  return (
    <ol className={clsx(classes.steps, className)}>
      {ActivationSteps.map((step, index) => {
        const isDone = isComplete || index < currentIndex;
        const isCurrent = !isComplete && index === currentIndex;

        return (
          <li
            key={step.id}
            className={clsx(classes.step, {
              [classes.done]: isDone,
              [classes.current]: isCurrent,
            })}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className={classes.marker}>
              {isDone ? <CheckIcon size={16} /> : index + 1}
            </span>

            <span className={classes.body}>
              <span className={classes.title}>{step.title}</span>
              <span className={classes.hint}>{step.hint}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
};
