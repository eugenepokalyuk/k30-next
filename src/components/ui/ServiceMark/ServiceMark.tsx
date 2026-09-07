import React, { CSSProperties, FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import classes from './ServiceMark.module.scss';

interface Props {
  logo: string | null;
  accentColor?: string;
  size?: number | null;
  className?: string;
}

export const ServiceMark: FC<Props> = ({
  logo,
  accentColor,
  size = 48,
  className,
}) => {
  const style = {
    ...(size ? { width: size, height: size } : null),
    ...(accentColor ? { '--accent': accentColor } : null),
  } as CSSProperties;

  return (
    <span className={clsx(classes.mark, className)} style={style}>
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={size ?? 48}
          height={size ?? 48}
          className={classes.logo}
        />
      ) : (
        <span className={classes.dot} />
      )}
    </span>
  );
};
