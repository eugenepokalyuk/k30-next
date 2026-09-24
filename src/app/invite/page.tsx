import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { Section } from '@/components/ui';

import { InviteView } from './_components/InviteView/InviteView';

export const metadata: Metadata = {
  title: 'Приглашение',
  robots: { index: false, follow: true },
};

export default function InvitePage() {
  return (
    <Suspense
      fallback={<Section overline="Приглашение" title="Загружаем…" />}
    >
      <InviteView />
    </Suspense>
  );
}
