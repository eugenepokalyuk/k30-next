export const CompanyName = 'К30 Market';
export const CompanyLegalName = 'K30 market';

/** Контакты вынесены в переменные окружения: телеграм поддержки меняется
 *  чаще, чем выходят релизы витрины. */
export const SupportTelegram =
  process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM ?? 'https://t.me/K30market';

export const SupportEmail = 'support@k30market.ru';

export const MarketplaceUrl = 'https://market.yandex.ru/';

/** Шаги активации. Порядок и подписи здесь, а не по компонентам: их
 *  показывают и шапка страницы, и трек-трейс, и тексты ошибок.
 *
 *  Шага три, и последний — ожидание. Активация у поставщиков асинхронная
 *  и занимает до двух минут: не покажешь это шагом — покупатель решит,
 *  что всё зависло, и уйдёт жать кнопку ещё раз. Отдельного «Готово» нет:
 *  ввод данных и подтверждение аккаунта происходят на одном экране, а
 *  результат — это не следующий шаг, а завершённый третий.
 */
export const ActivationSteps = [
  { id: 'key', title: 'Ключ', hint: 'Проверяем код' },
  { id: 'account', title: 'Аккаунт', hint: 'Данные и подтверждение' },
  { id: 'progress', title: 'Активация', hint: 'Выдаём подписку' },
] as const;

export type ActivationStepId = (typeof ActivationSteps)[number]['id'];

/** Сколько ждём, прежде чем предложить не сидеть у экрана.
 *
 *  Две минуты — потолок обычной активации Claude по документации
 *  поставщиков. Дольше — повод сказать, что ждать у экрана необязательно,
 *  а не делать вид, что всё идёт по плану.
 */
export const ActivationLongWaitSeconds = 120;
