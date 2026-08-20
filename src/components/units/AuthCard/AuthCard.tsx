import React, { FC, PropsWithChildren } from 'react';

import { Reveal } from '@/components/motion';

import classes from './AuthCard.module.scss';

interface Props extends PropsWithChildren {
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

/** Обёртка форм входа и регистрации — они отличаются только полями. */
export const AuthCard: FC<Props> = ({
  title,
  description,
  footer,
  children,
}) => (
  <div className={classes.page}>
    <Reveal className={classes.card} y={12}>
      <header className={classes.header}>
        <h1 className={classes.title}>{title}</h1>
        {description && <p className={classes.description}>{description}</p>}
      </header>

      {children}

      {footer && <div className={classes.footer}>{footer}</div>}
    </Reveal>
  </div>
);
