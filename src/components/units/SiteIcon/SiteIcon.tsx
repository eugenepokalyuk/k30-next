'use client';

import { FC, useEffect } from 'react';

import { useSiteSettings } from '@/lib/hooks';

/** Иконка во вкладке браузера из админки.
 *
 *  Сайт собран статикой, и ссылки на иконки в <head> вписаны при сборке.
 *  Если в настройках загружен логотип, подменяем их адрес уже в браузере.
 *  Иконку для «На экран Домой» и поисковиков это не трогает: они читают
 *  разметку, а не то, что сделал скрипт, — там остаются файлы из public/
 */
export const SiteIcon: FC = () => {
  const { logo } = useSiteSettings();

  useEffect(() => {
    if (!logo) return;

    document
      .querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"], link[rel="shortcut icon"]',
      )
      .forEach((link) => {
        link.href = logo;
        link.removeAttribute('type');
        link.removeAttribute('sizes');
      });
  }, [logo]);

  return null;
};
