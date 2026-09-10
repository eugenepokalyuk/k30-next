'use client';

import React, { FC } from 'react';

import { Button } from '@/components/ui';

import classes from './TargetStep.module.scss';
import { AccountBar } from './AccountBar';

interface Props {
  note: string;
  email: string;
  isStarting: boolean;
  onConfirm: () => void;
}

export const AccountConfirmation: FC<Props> = ({
  note,
  email,
  isStarting,
  onConfirm,
}) => (
  <div className={classes.account}>
    {note && <p className={classes.note}>{note}</p>}

    <AccountBar email={email}>
      <Button
        type="button"
        size="large"
        onClick={onConfirm}
        loading={isStarting}
        className={classes.button}
        fullWidth={!email}
      >
        {'Подтвердить и активировать'}
      </Button>
    </AccountBar>
  </div>
);
