'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { useHomeRoute } from '@/lib/hooks';
import { useSiteSettingsQuery } from '@/store/api/k30Api';
import { CompanyName } from '@/utils/consts';

import classes from './Logo.module.scss';
import bundledLogo from './logo.png';

interface Props {
  className?: string;
}

export const Logo: FC<Props> = ({ className }) => {
  const home = useHomeRoute();
  const { data, isError } = useSiteSettingsQuery();

  // Пока настройки едут, место под знак пустое: иначе при загруженном в
  // админке логотипе на долю секунды мелькал бы старый из сборки
  const src = data ? (data.logo ?? bundledLogo) : isError ? bundledLogo : null;

  return (
    <Link href={home} className={clsx(classes.logo, className)}>
      {src ? (
        <Image
          src={src}
          alt=""
          width={34}
          height={34}
          className={classes.mark}
        />
      ) : (
        <span className={classes.mark} aria-hidden />
      )}
      <span className={classes.name}>{CompanyName}</span>
    </Link>
  );
};
