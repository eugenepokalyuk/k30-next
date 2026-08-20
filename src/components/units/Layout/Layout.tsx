import React, { FC, PropsWithChildren } from 'react';

import classes from './Layout.module.scss';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className={classes.layout}>
    <Header />
    <main className={classes.main}>{children}</main>
    <Footer />
  </div>
);
