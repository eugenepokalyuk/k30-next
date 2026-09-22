'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { BlockIcon, Notice } from '@/components/ui';
import type { PaymentMethodDto } from '@/store/api/types';

import classes from './PaymentMethods.module.scss';

interface Props {
  methods: PaymentMethodDto[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  unavailableText?: string;
  notice?: string;
}

export const PaymentMethods: FC<Props> = ({
  methods,
  value,
  onChange,
  disabled,
  isLoading,
  unavailableText,
  notice,
}) => (
  <div className={classes.section}>
    <p className={classes.title}>Способ оплаты</p>

    {isLoading ? (
      <div className={classes.skeletons} aria-hidden>
        <span className={classes.skeleton} />
        <span className={classes.skeleton} />
      </div>
    ) : !methods.length ? (
      <Notice tone="error" title="Оплата недоступна">
        {unavailableText ||
          'Оплата на сайте временно недоступна. Напишите в поддержку — оформим заказ вручную.'}
      </Notice>
    ) : (
      <>
        <div
          className={classes.list}
          role="radiogroup"
          aria-label="Способ оплаты"
        >
          {methods.map((method) => {
            const checked = method.id === value;

            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(method.id)}
                className={clsx(classes.method, checked && classes.checked)}
              >
                <span className={classes.icon}>
                  <BlockIcon name={method.icon} size={20} />
                </span>

                <span className={classes.text}>
                  <span className={classes.name}>{method.title}</span>
                  {method.description && (
                    <span className={classes.hint}>{method.description}</span>
                  )}
                </span>

                <span className={classes.mark} aria-hidden />
              </button>
            );
          })}
        </div>

        {notice && <p className={classes.notice}>{notice}</p>}
      </>
    )}
  </div>
);
