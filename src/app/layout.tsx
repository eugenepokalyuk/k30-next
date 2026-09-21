import React from 'react';
import { getColorSchemeScript } from 'react-stateful-hooks';
import type { Metadata } from 'next';
import Script from 'next/script';

import { Layout } from '@/components/units';
import { getFonts } from '@/lib/helpers';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/hooks/useTheme';
import { AppProviders } from '@/lib/providers';
import { CompanyName } from '@/utils/consts';

import 'normalize.css';
import '../styles/globals.scss';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const description =
  'Подписки на ChatGPT, Claude, Gemini, Grok и Perplexity по ключу активации. ' +
  'Ключ приходит сразу после оплаты, активация занимает пару минут';

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
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: '16x16 32x32 48x48' },
      { url: `${basePath}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${basePath}/icon.png`, sizes: '512x512', type: 'image/png' },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: { url: `${basePath}/apple-touch-icon.png`, sizes: '180x180' },
  },
};

const themeScript = getColorSchemeScript({
  key: THEME_STORAGE_KEY,
  attribute: 'data-theme',
  defaultScheme: DEFAULT_THEME,
});

type Props = Readonly<React.PropsWithChildren>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <body className={getFonts()}>
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>

        <Script
          id="telegram-web-app"
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />

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
