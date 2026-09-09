import React, { FC } from 'react';
import clsx from 'clsx';

import classes from './SuccessMark.module.scss';
import { CheckIcon } from '../Icons/Icons';

interface Props {
  className?: string;
}

export const SuccessMark: FC<Props> = ({ className }) => (
  <span className={clsx(classes.mark, className)} aria-hidden="true">
    <CheckIcon size={22} />
  </span>
);
