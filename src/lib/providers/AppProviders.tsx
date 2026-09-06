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
    {/* reducedMotion="user" — одна настройка на все анимации: сдвиги и
        масштаб убираются, проявление остаётся */}
    <MotionConfig reducedMotion="user" transition={transition}>
      {children}
    </MotionConfig>
  </Provider>
);
