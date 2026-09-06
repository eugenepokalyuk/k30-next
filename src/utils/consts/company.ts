export const CompanyName = 'К30 Market';
export const CompanyLegalName = 'K30 market';

/**
 *  Контакты вынесены в переменные окружения: телеграм поддержки меняется
 *  чаще, чем выходят релизы витрины.
 */
export const SupportTelegram =
  process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM ?? 'https://t.me/K30market';

export const SupportEmail = 'support@k30market.ru';

export const MarketplaceUrl = 'https://market.yandex.ru/';

/** Шаги активации. */
export const ActivationSteps = [
  { id: 'key', title: 'Ключ', hint: 'Проверяем код' },
  { id: 'account', title: 'Аккаунт', hint: 'Данные и подтверждение' },
  { id: 'progress', title: 'Активация', hint: 'Выдаём подписку' },
] as const;

export type ActivationStepId = (typeof ActivationSteps)[number]['id'];

/** Сколько ждём, прежде чем предложить не сидеть у экрана. */
export const ActivationLongWaitSeconds = 120;
