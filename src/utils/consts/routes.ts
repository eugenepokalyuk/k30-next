export const Routes = {
  Home: '/',
  Activate: '/activate',
  Login: '/login',
  Account: '/account',
  Services: '/#services',
  AllServices: '/services',
  How: '/#how',
  Faq: '/#faq',

  TgMore: '/tg/more',

  Buy: '/buy',
  BuyPlans: '/buy/plans',
  Checkout: '/checkout',

  Terms: '/terms',
  Privacy: '/privacy',
};

export const activateRoute = (code: string) =>
  `${Routes.Activate}?key=${encodeURIComponent(code)}`;

export const buyPlansRoute = (service: string) =>
  `${Routes.BuyPlans}?service=${encodeURIComponent(service)}`;

export const checkoutRoute = (service: string, plan: string) =>
  `${Routes.Checkout}?service=${encodeURIComponent(service)}` +
  `&plan=${encodeURIComponent(plan)}`;
