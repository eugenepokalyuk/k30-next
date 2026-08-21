import { Routes } from '@/utils/consts';

/** Разделы в шапке. Один список на десктопную навигацию и мобильную
 *  панель — иначе они однажды разъедутся, и на телефоне пропадёт пункт,
 *  который на широком экране есть. */
export const navLinks = [
  { href: Routes.Services, label: 'Сервисы' },
  { href: Routes.How, label: 'Как это работает' },
  { href: Routes.Faq, label: 'Вопросы' },
];
