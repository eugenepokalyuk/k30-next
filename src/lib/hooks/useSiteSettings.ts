'use client';

import { useSiteSettingsQuery } from '@/store/api/k30Api';
import type { SiteSettingsDto } from '@/store/api/types';
import { SupportTelegram } from '@/utils/consts';

/** Чем живёт витрина, пока настройки не приехали.
 *
 *  Оба флага показа выключены намеренно: пустой блок покупки и круглая
 *  кнопка без адреса появлялись бы на долю секунды при каждой загрузке
 *  и тут же исчезали, если менеджер их выключил. Лучше показать позже,
 *  чем мигнуть.
 *
 *  Телеграм поддержки — единственное исключение: он есть в шапке и в
 *  подвале всегда, и на время загрузки берётся из сборки.
 */
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

/** Ссылки и подписи витрины из админки.
 *
 *  Хук, а не проп через дерево: настройки нужны шапке, подвалу, блоку
 *  покупки и кнопке в углу — то есть в четырёх местах, не связанных
 *  между собой. RTK Query при этом сходит на сервер один раз и раздаст
 *  всем один и тот же кэш.
 */
export const useSiteSettings = (): SiteSettingsDto => {
  const { data } = useSiteSettingsQuery();
  return data ?? fallback;
};
