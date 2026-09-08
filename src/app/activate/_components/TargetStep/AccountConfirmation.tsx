'use client';

import React, { FC } from 'react';

import { Button } from '@/components/ui';

import classes from './TargetStep.module.scss';

interface Props {
  /** Примечание сервиса из админки — единственное, чем экраны различаются */
  note: string;
  isStarting: boolean;
  onConfirm: () => void;
}

/**
 *  Последний экран перед активацией. Намеренно без итогов проверки: одни
 *  поставщики умеют предпроверку, другие нет, и раньше страницы Claude,
 *  ChatGPT и Grok расходились в этом месте до неузнаваемости
 */
export const AccountConfirmation: FC<Props> = ({
  note,
  isStarting,
  onConfirm,
}) => (
  <div className={classes.account}>
    {note && <p className={classes.note}>{note}</p>}

    <Button
      type="button"
      size="large"
      onClick={onConfirm}
      loading={isStarting}
      className={classes.button}
    >
      Подтвердить и активировать
    </Button>
  </div>
);
