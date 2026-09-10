'use client';

import React, { FC, ReactNode } from 'react';

import { UserIcon } from '@/components/ui';

import classes from './TargetStep.module.scss';

interface Props {
  email: string;
  children: ReactNode;
}

export const AccountBar: FC<Props> = ({ email, children }) => {
  if (!email) return <>{children}</>;

  return (
    <div className={classes.actions}>
      <span className={classes.user}>
        <UserIcon size={20} className={classes.user_icon} />
        {email}
      </span>

      {children}
    </div>
  );
};
