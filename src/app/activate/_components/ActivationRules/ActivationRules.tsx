'use client';

import React, { FC } from 'react';

import { Button, Modal } from '@/components/ui';
import { SupportTelegram } from '@/utils/consts';
import { parseInstruction } from '@/utils/helpers';

import classes from './ActivationRules.module.scss';

interface Props {
  serviceName: string;
  /** Текст правил из админки — свой у каждого сервиса. */
  rules: string;
  onAccept: () => void;
}

/** Правила активации: последнее окно, где покупателя ещё можно
 *  остановить.
 *
 *  Закрыть его мимо кнопок нельзя — ни Escape, ни щелчком по фону.
 *  Соглашаться необязательно, но тогда разговор идёт в поддержку, а не
 *  в форму: активация необратима, и «случайно пролистал» здесь стоит
 *  ключа.
 */
export const ActivationRules: FC<Props> = ({
  serviceName,
  rules,
  onAccept,
}) => {
  const blocks = parseInstruction(rules);

  return (
    <Modal
      isOpen
      title={`Правила активации ${serviceName}`}
      isDismissible={false}
    >
      <h2 className={classes.title}>Правила активации {serviceName}</h2>

      <div className={classes.rules}>
        {blocks.map((block, index) =>
          block.type === 'list' ? (
            <ul key={index} className={classes.list}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className={classes.item}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p key={index} className={classes.paragraph}>
              {block.text}
            </p>
          ),
        )}
      </div>

      <div className={classes.actions}>
        <Button type="button" size="large" onClick={onAccept}>
          Я ознакомился — перейти к активации
        </Button>

        <Button href={SupportTelegram} external variant="outlined" size="large">
          Не согласен — написать в поддержку
        </Button>
      </div>
    </Modal>
  );
};
