'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { useAppSelector } from '@/store/hooks';
import { selectIsMiniApp } from '@/store/slices/telegram';

import classes from './Layout.module.scss';
import { BottomNav } from '../BottomNav/BottomNav';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { PageBackground } from '../PageBackground/PageBackground';
import { TelegramWidget } from '../TelegramWidget/TelegramWidget';

export const Layout: FC<React.PropsWithChildren> = ({ children }) => {
  const isMiniApp = useAppSelector(selectIsMiniApp);

  return (
    <div className={clsx(classes.layout, { [classes.mini_app]: isMiniApp })}>
      <PageBackground />

      <Header />
      <main className={classes.main}>{children}</main>

      {!isMiniApp && <Footer />}

      {!isMiniApp && <TelegramWidget />}

      <BottomNav />
    </div>
  );
};
