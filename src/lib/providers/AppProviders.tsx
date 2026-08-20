'use client';

import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { MotionConfig } from 'framer-motion';

import { transition } from '@/components/motion';
import { store } from '@/store/store';

import { AuthHydrator } from './AuthHydrator';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>
    <AuthHydrator />
    {/* reducedMotion="user" — одна настройка на все анимации сразу:
        при включённом «уменьшить движение» framer-motion сам убирает
        сдвиги и масштабирование, оставляя проявление. Иначе это
        пришлось бы помнить в каждом компоненте. */}
    <MotionConfig reducedMotion="user" transition={transition}>
      {children}
    </MotionConfig>
  </Provider>
);
