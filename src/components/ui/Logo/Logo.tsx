'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { useHomeRoute } from '@/lib/hooks';
import { CompanyName } from '@/utils/consts';

import classes from './Logo.module.scss';
import logo from './logo.png';

interface Props {
  className?: string;
}

export const Logo: FC<Props> = ({ className }) => {
  const home = useHomeRoute();

  return (
    <Link href={home} className={clsx(classes.logo, className)}>
      <Image
        src={logo}
        alt=""
        width={34}
        height={34}
        className={classes.mark}
      />
      <span className={classes.name}>{CompanyName}</span>
    </Link>
  );
};
