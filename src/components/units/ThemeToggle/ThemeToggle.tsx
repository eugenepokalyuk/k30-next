'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { MoonIcon, SunIcon } from '@/components/ui';
import { useTheme } from '@/lib/hooks';

import classes from './ThemeToggle.module.scss';

interface Props {
  className?: string;
}

/** Переключатель светлой и тёмной темы */
export const ThemeToggle: FC<Props> = ({ className }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';

  return (
    <button
      type="button"
      className={clsx(classes.toggle, className)}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
};
