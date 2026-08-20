'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { type ActivationStepId, ActivationSteps } from '@/utils/consts';

import classes from './Steps.module.scss';
import { CheckIcon } from '../Icons/Icons';

interface Props {
  current: ActivationStepId;
  className?: string;
}

/** Трек-трейс активации: где покупатель сейчас и что впереди.
 *
 *  Шаги приходят из констант, а не из пропсов: их состав один на всё
 *  приложение, а список здесь и текст ошибок в другом месте разъехались
 *  бы при первой же правке.
 *
 *  Раньше это были карточки в ряд — на телефоне они сжимались до 110px
 *  и подпись переносилась по слогам. Теперь это полоса прогресса:
 *  номера на линии, подписи под ними. Ширину колонок задаёт сетка по
 *  числу шагов, поэтому добавить шаг можно правкой одних констант.
 */
export const Steps: FC<Props> = ({ current, className }) => {
  const currentIndex = ActivationSteps.findIndex((step) => step.id === current);

  return (
    <ol className={clsx(classes.steps, className)}>
      {ActivationSteps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step.id}
            className={clsx(classes.step, {
              [classes.done]: isDone,
              [classes.current]: isCurrent,
            })}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {/* Все кружки одного размера — от этого зависит ритм полосы:
                воздух до линии и расстояние до подписи отсчитаны от
                радиуса. Текущий шаг выделен заливкой и свечением, а не
                масштабом: увеличенный кружок съедал воздух вокруг себя,
                и шаги переставали стоять ровно. */}
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
