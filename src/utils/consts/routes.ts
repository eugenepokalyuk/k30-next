export const Routes = {
  Home: '/',
  Activate: '/activate',
  Login: '/login',
  Account: '/account',
  Services: '/#services',
  AllServices: '/services',
  How: '/#how',
  Faq: '/#faq',
};

/** Страница активации с уже проверенным ключом */
export const activateRoute = (code: string) =>
  `${Routes.Activate}?key=${encodeURIComponent(code)}`;
