import React from 'react';
import type { Metadata } from 'next';

import { TgRedirect } from './TgRedirect';

export const metadata: Metadata = {
  title: 'K30',
  robots: { index: false, follow: false },
};

/** Отдельной витрины для Telegram больше нет — всё живёт на главной.
 *  Страница остаётся заглушкой-переадресацией: адрес /tg зашит в кнопке меню
 *  бота и разошёлся по старым ссылкам, а сайт раздаётся статикой, так что
 *  перенаправить некому — кроме самой страницы */
export default function TgRedirectPage() {
  return <TgRedirect />;
}
