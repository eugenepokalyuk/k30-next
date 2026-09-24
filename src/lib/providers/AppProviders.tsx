'use client';

import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { MotionConfig } from 'framer-motion';

import { transition } from '@/components/motion';
import { store } from '@/store/store';

import { AuthHydrator } from './AuthHydrator';
import { CartHydrator } from './CartHydrator';
import { ReferralCatcher } from './ReferralCatcher';
import { TelegramHydrator } from './TelegramHydrator';

export const AppProviders: FC<React.PropsWithChildren> = ({ children }) => (
  <Provider store={store}>
    <AuthHydrator />
    <TelegramHydrator />
    <CartHydrator />
    <ReferralCatcher />
    <MotionConfig reducedMotion="user" transition={transition}>
      {children}
    </MotionConfig>
  </Provider>
);
