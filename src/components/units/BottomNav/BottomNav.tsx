'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { useSiteSettings } from '@/lib/hooks';
import { openExternal } from '@/lib/telegram';
import { useAppSelector } from '@/store/hooks';
import { selectIsMiniApp } from '@/store/slices/telegram';

import classes from './BottomNav.module.scss';
import { bottomNavItems } from './navItems';

const currentHref = (pathname: string, hrefs: string[]) => {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  return hrefs
    .filter((href) => normalized === href || normalized.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
};

export const BottomNav: FC = () => {
  const isMiniApp = useAppSelector(selectIsMiniApp);
  const pathname = usePathname();
  const { telegram_support_url } = useSiteSettings();

  const active = currentHref(
    pathname,
    bottomNavItems.flatMap((item) => item.href ?? []),
  );

  if (!isMiniApp) return null;

  return (
    <nav className={classes.nav} aria-label="Разделы приложения">
      {bottomNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = Boolean(item.href && item.href === active);

        const content = (
          <>
            <Icon size={22} className={classes.icon} />
            <span className={classes.label}>{item.label}</span>
          </>
        );

        if (item.isSupport) {
          return (
            <button
              key={item.label}
              type="button"
              className={classes.item}
              onClick={() => openExternal(telegram_support_url)}
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href ?? '/'}
            className={clsx(classes.item, { [classes.active]: isActive })}
            aria-current={isActive ? 'page' : undefined}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};
