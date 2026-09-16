'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { useHomeRoute } from '@/lib/hooks';
import { CompanyName } from '@/utils/consts';

import classes from './Logo.module.scss';

interface Props {
  className?: string;
}

export const Logo: FC<Props> = ({ className }) => {
  const home = useHomeRoute();

  return (
    <Link href={home} className={clsx(classes.logo, className)}>
      <span className={classes.mark} aria-hidden>
        K
      </span>
      <span className={classes.name}>{CompanyName}</span>
    </Link>
  );
};
