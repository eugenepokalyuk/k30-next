import type { FC } from 'react';

import {
  HomeIcon,
  type IconProps,
  MenuIcon,
  SupportIcon,
  UserIcon,
} from '@/components/ui';
import { Routes } from '@/utils/consts';

export interface BottomNavItem {
  label: string;
  icon: FC<IconProps>;
  href?: string;
  isSupport?: boolean;
}

export const bottomNavItems: BottomNavItem[] = [
  { label: 'Главная', icon: HomeIcon, href: Routes.Home },
  { label: 'Профиль', icon: UserIcon, href: Routes.Account },
  { label: 'Поддержка', icon: SupportIcon, isSupport: true },
  { label: 'Ещё', icon: MenuIcon, href: Routes.TgMore },
];
