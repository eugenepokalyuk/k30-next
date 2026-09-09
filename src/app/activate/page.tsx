import React from 'react';
import type { Metadata } from 'next';

import { ActivateView } from './_components/ActivateView/ActivateView';

export const metadata: Metadata = {
  title: 'Активация подписки',
  robots: { index: false, follow: false },
};

export default function ActivatePage() {
  return (
    <React.Suspense fallback={null}>
      <ActivateView />
    </React.Suspense>
  );
}
