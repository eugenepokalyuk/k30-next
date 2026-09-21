import React, { FC, ReactNode } from 'react';

import { Section, SuccessMark } from '@/components/ui';

import classes from './StatusScreen.module.scss';

interface Props {
  overline: string;
  title: string;
  mark?: boolean;
  text?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

export const StatusScreen: FC<Props> = ({
  overline,
  title,
  mark,
  text,
  children,
  actions,
}) => (
  <Section overline={overline} title={title} centered>
    <div className={classes.screen}>
      {mark && <SuccessMark />}
      {text && <p className={classes.text}>{text}</p>}
      {children}
      {actions && <div className={classes.actions}>{actions}</div>}
    </div>
  </Section>
);
