'use client';

import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { MotionConfig } from 'framer-motion';

import { transition } from '@/components/motion';
import { store } from '@/store/store';

import { AuthHydrator } from './AuthHydrator';
import { CartHydrator } from './CartHydrator';
import { TelegramHydrator } from './TelegramHydrator';

export const AppProviders: FC<React.PropsWithChildren> = ({ children }) => (
  <Provider store={store}>
    <AuthHydrator />
    <TelegramHydrator />
    <CartHydrator />
    <MotionConfig reducedMotion="user" transition={transition}>
      {children}
    </MotionConfig>
  </Provider>
);
