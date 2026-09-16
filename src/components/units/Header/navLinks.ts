'use client';

import { useAppSelector } from '@/store/hooks';
import { selectIsMiniApp } from '@/store/slices/telegram';
import { Routes } from '@/utils/consts';

export interface NavLink {
  href: string;
  label: string;
}

const webLinks: NavLink[] = [
  { href: Routes.Services, label: 'Сервисы' },
  { href: Routes.How, label: 'Как это работает' },
  { href: Routes.Faq, label: 'Вопросы' },
];

const miniAppLinks: NavLink[] = [
  { href: `${Routes.Tg}#services`, label: 'Сервисы' },
];

export const useNavLinks = (): NavLink[] =>
  useAppSelector(selectIsMiniApp) ? miniAppLinks : webLinks;
