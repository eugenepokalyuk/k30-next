export const Routes = {
  Home: '/',
  Activate: '/activate',
  Login: '/login',
  Account: '/account',
  Services: '/#services',
  AllServices: '/services',
  How: '/#how',
  Faq: '/#faq',

  /** Документы в Mini App. Адрес остался от бывшей витрины /tg */
  TgMore: '/tg/more',

  Buy: '/buy',
  BuyPlans: '/buy/plans',
  Checkout: '/checkout',

  Terms: '/terms',
  Privacy: '/privacy',
};

/** Страница активации с уже проверенным ключом */
export const activateRoute = (code: string) =>
  `${Routes.Activate}?key=${encodeURIComponent(code)}`;

/** Тарифы выбранного сервиса */
export const buyPlansRoute = (service: string) =>
  `${Routes.BuyPlans}?service=${encodeURIComponent(service)}`;

/**
 *  Оформление выбранного тарифа.
 *
 *  Сервис и тариф стоят в адресе, хотя корзина и так лежит в браузере:
 *  так ссылку на оформление можно переслать себе же на другое устройство,
 *  а возврат «назад» из оплаты открывает тот заказ, а не последний
 */
export const checkoutRoute = (service: string, plan: string) =>
  `${Routes.Checkout}?service=${encodeURIComponent(service)}` +
  `&plan=${encodeURIComponent(plan)}`;
