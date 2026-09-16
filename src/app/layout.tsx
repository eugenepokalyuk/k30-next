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
    // своего домена сайт лежит в подкаталоге, и иконка искалась бы в корне
    icon: [{ url: `${basePath}/favicon.svg`, type: 'image/svg+xml' }],
    shortcut: `${basePath}/favicon.svg`,
  },
};

// Тема стоит на <html> до первой отрисовки
const themeScript = getColorSchemeScript({
  key: THEME_STORAGE_KEY,
  attribute: 'data-theme',
  defaultScheme: DEFAULT_THEME,
});

type Props = Readonly<React.PropsWithChildren>;

export default function RootLayout({ children }: Props) {
  return (
    // suppressHydrationWarning — про тему и только про неё: скрипт ниже
    // меняет data-theme и color-scheme на <html> до гидрации, и React
    // честно жалуется на расхождение с разметкой сервера
    <html lang="ru" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <body className={getFonts()}>
        {/* next/script, а не голый <script>: beforeInteractive кладёт код
            в разметку до гидрации, где он и должен сработать */}
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
