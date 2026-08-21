export const Routes = {
  Home: '/',
  Activate: '/activate',
  Login: '/login',
  Account: '/account',
  Services: '/#services',
  How: '/#how',
  Faq: '/#faq',
};

/** Страница активации с уже проверенным ключом.
 *
 *  Код в query, а не в пути: страница одна на все ключи, а код —
 *  временное состояние конкретного визита. Заодно ссылку можно
 *  переслать в поддержку как есть.
 */
export const activateRoute = (code: string) =>
  `${Routes.Activate}?key=${encodeURIComponent(code)}`;
