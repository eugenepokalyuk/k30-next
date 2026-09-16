import React from 'react';
import type { Metadata } from 'next';

import { Section } from '@/components/ui';

import { PlanPicker } from './_components/PlanPicker/PlanPicker';

export const metadata: Metadata = {
  title: 'Тарифы',
  robots: { index: false, follow: true },
};

export default function BuyPlansPage() {
  return (
    <React.Suspense
      fallback={<Section overline="Покупка" title="Загружаем тарифы…" />}
    >
      <PlanPicker />
    </React.Suspense>
  );
}
