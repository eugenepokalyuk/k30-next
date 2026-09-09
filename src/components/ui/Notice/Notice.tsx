import React, { FC } from 'react';
import clsx from 'clsx';

import classes from './Notice.module.scss';
import { AlertIcon, CheckIcon } from '../Icons/Icons';

interface Props extends React.PropsWithChildren {
  tone?: 'info' | 'success' | 'error';
  title?: string;
  className?: string;
}

export const Notice: FC<Props> = ({
  tone = 'info',
  title,
  className,
  children,
}) => (
  <div
    className={clsx(classes.notice, classes[tone], className)}
    role={tone === 'error' ? 'alert' : 'status'}
  >
    <span className={classes.icon}>
      {tone === 'success' ? <CheckIcon size={18} /> : <AlertIcon size={18} />}
    </span>

    <div className={classes.body}>
      {title && <p className={classes.title}>{title}</p>}
      {children && <div className={classes.text}>{children}</div>}
    </div>
  </div>
);
