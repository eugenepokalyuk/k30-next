'use client';

import React, { FC } from 'react';

import type { TelegramWidgetUser } from '@/store/api/types';

import classes from './TelegramLoginButton.module.scss';

const SCRIPT_SRC = 'https://telegram.org/js/telegram-widget.js?22';
const CALLBACK = 'k30TelegramAuth';

declare global {
  interface Window {
    k30TelegramAuth?: (user: TelegramWidgetUser) => void;
  }
}

interface Props {
  bot: string;
  onAuth: (user: TelegramWidgetUser) => void;
}

export const TelegramLoginButton: FC<Props> = ({ bot, onAuth }) => {
  const host = React.useRef<HTMLDivElement>(null);
  const handler = React.useRef(onAuth);

  React.useEffect(() => {
    handler.current = onAuth;
  }, [onAuth]);

  React.useEffect(() => {
    const container = host.current;
    if (!container || !bot) return;

    window.k30TelegramAuth = (user) => handler.current(user);

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute('data-telegram-login', bot);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', `${CALLBACK}(user)`);
    container.appendChild(script);

    return () => {
      container.replaceChildren();
      delete window.k30TelegramAuth;
    };
  }, [bot]);

  return <div ref={host} className={classes.button} />;
};
