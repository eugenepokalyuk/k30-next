export const CompanyName = 'K30MAРКЕТ';
export const CompanyLegalName = 'K30MAРКЕТ';

export const SupportTelegram =
  process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM ?? 'https://t.me/K30market';

export const SupportEmail = 'support@k30market.ru';

export const MarketplaceUrl = 'https://market.yandex.ru/';

export const ActivationSteps = [
  { id: 'key', title: 'Ключ', hint: 'Проверяем код' },
  { id: 'account', title: 'Аккаунт', hint: 'Данные и подтверждение' },
  { id: 'progress', title: 'Активация', hint: 'Выдаём подписку' },
] as const;

export type ActivationStepId = (typeof ActivationSteps)[number]['id'];

export const ActivationLongWaitSeconds = 120;
