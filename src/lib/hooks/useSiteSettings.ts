'use client';

import { useSiteSettingsQuery } from '@/store/api/k30Api';
import type { SiteSettingsDto } from '@/store/api/types';
import { SupportTelegram } from '@/utils/consts';

/** Чем живёт витрина, пока настройки не приехали */
const fallback: SiteSettingsDto = {
  telegram_channel_url: '',
  telegram_support_url: SupportTelegram,
  telegram_bot_url: '',
  widget_is_enabled: false,
  buy_is_enabled: false,
  buy_title: 'Купить ключ',
  buy_text: '',
  buy_telegram_url: '',
  buy_yandex_market_url: '',
  review_yandex_market_url: '',
};

/** Ссылки и подписи витрины из админки */
export const useSiteSettings = (): SiteSettingsDto => {
  const { data } = useSiteSettingsQuery();
  return data ?? fallback;
};
