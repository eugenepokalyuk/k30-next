import React, { FC, PropsWithChildren } from 'react';

import classes from './Layout.module.scss';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { TelegramWidget } from '../TelegramWidget/TelegramWidget';

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className={classes.layout}>
    <Header />
    <main className={classes.main}>{children}</main>
    <Footer />
    {/* Кнопка телеграма живёт в раскладке, а не на главной: писать в
        канал чаще всего хотят как раз со страницы активации, когда
        что-то пошло не так. */}
    <TelegramWidget />
  </div>
);
