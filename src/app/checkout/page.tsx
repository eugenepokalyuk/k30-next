import React from 'react';
import type { Metadata } from 'next';

import { Section } from '@/components/ui';

import { CheckoutView } from './_components/CheckoutView/CheckoutView';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <Section overline="Оформление заказа" title="Загружаем заказ…" />
      }
    >
      <CheckoutView />
    </React.Suspense>
  );
}
