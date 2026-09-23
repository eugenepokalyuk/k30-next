'use client';

import React from 'react';

import { useCheckPromoMutation } from '@/store/api/k30Api';
import type { AppliedPromoDto } from '@/store/api/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  promoApplied,
  promoCleared,
  selectCartPromo,
  selectCartReady,
} from '@/store/slices/cart';

interface Options {
  service: string;
  plan: string;
  skip: boolean;
}

export const usePromo = ({ service, plan, skip }: Options) => {
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectCartPromo);
  const isCartReady = useAppSelector(selectCartReady);

  const [check, { isLoading }] = useCheckPromoMutation();

  const [applied, setApplied] = React.useState<AppliedPromoDto | null>(null);
  const [error, setError] = React.useState('');

  const apply = React.useCallback(
    async (code: string, { silent = false } = {}) => {
      const value = code.trim();
      if (!value) return false;

      try {
        const result = await check({ code: value, service, plan }).unwrap();

        if (!result.success || !result.promo) {
          setApplied(null);
          setError(silent ? '' : result.error);
          dispatch(promoCleared());
          return false;
        }

        setApplied(result.promo);
        setError('');
        dispatch(promoApplied(result.promo.code));
        return true;
      } catch {
        setApplied(null);
        setError(
          silent ? '' : 'Не получилось проверить промокод. Попробуйте ещё раз',
        );
        return false;
      }
    },
    [check, plan, service],
  );

  const dismiss = React.useCallback(() => setError(''), []);

  const clear = React.useCallback(() => {
    setApplied(null);
    setError('');
    dispatch(promoCleared());
  }, []);

  const reject = React.useCallback(
    (message: string) => {
      setApplied(null);
      setError(message);
      dispatch(promoCleared());
    },
    [],
  );

  const rechecked = React.useRef('');

  React.useEffect(() => {
    if (skip || !isCartReady || !service || !plan) return;
    if (!saved || applied?.code === saved) return;
    if (rechecked.current === `${saved}:${service}:${plan}`) return;

    rechecked.current = `${saved}:${service}:${plan}`;
    apply(saved, { silent: true });
  }, [apply, applied, isCartReady, plan, saved, service, skip]);

  return {
    applied,
    error,
    isChecking: isLoading,
    apply,
    clear,
    dismiss,
    reject,
  };
};

export type Promo = ReturnType<typeof usePromo>;
