import React from 'react';
import type { Metadata } from 'next';

import { Layout } from '@/components/units';
import { getFonts } from '@/lib/helpers';
import { AppProviders } from '@/lib/providers';
import { CompanyName } from '@/utils/consts';

import 'normalize.css';
import '../styles/globals.scss';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const description =
  'Подписки на ChatGPT, Claude, Gemini, Grok и Perplexity по ключу активации. ' +
  'Ключ приходит сразу после оплаты, активация занимает пару минут.';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://k30market.ru',
  ),
  title: {
    default: `${CompanyName} — активация подписок по ключу`,
    template: `${CompanyName} | %s`,
  },
  description,
  applicationName: CompanyName,
  keywords: [
    'активация ключа',
    'подписка ChatGPT',
    'Claude Pro',
    'Gemini Pro',
    'оплата зарубежных подписок',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: CompanyName,
    title: `${CompanyName} — активация подписок по ключу`,
    description,
  },
  icons: {
    // basePath к ссылкам в метаданных Next не подставляет — на Pages без
    // своего домена сайт лежит в подкаталоге, и иконка искалась бы в корне.
    icon: [{ url: `${basePath}/favicon.svg`, type: 'image/svg+xml' }],
    shortcut: `${basePath}/favicon.svg`,
  },
};

type Props = Readonly<React.PropsWithChildren>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru">
      <body className={getFonts()}>
        {/* Блоки с анимацией появления приезжают в html уже с opacity 0 —
            их показывает framer-motion после гидрации. Если скрипты не
            выполнились, страница осталась бы пустой, поэтому запасной
            стиль возвращает их на место. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <AppProviders>
          <Layout>{children}</Layout>
        </AppProviders>
      </body>
    </html>
  );
}
