import React, { FC } from 'react';

import classes from './Layout.module.scss';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { PageBackground } from '../PageBackground/PageBackground';
import { TelegramWidget } from '../TelegramWidget/TelegramWidget';

export const Layout: FC<React.PropsWithChildren> = ({ children }) => (
  <div className={classes.layout}>
    <PageBackground />

    <Header />
    <main className={classes.main}>{children}</main>
    <Footer />
    <TelegramWidget />
  </div>
);
