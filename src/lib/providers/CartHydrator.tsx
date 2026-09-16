'use client';

import React, { FC } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { cartHydrated, cartStorage } from '@/store/slices/cart';

export const CartHydrator: FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(cartHydrated(cartStorage.read()));
  }, []);

  return null;
};
