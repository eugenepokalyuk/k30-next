import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { ActivateView } from './_components/ActivateView/ActivateView';

export const metadata: Metadata = {
  title: 'Активация подписки',
  // Страница открывается по ссылке с ключом в адресе — в поиске ей
  // делать нечего.
  robots: { index: false, follow: false },
};

export default function ActivatePage() {
  return (
    // useSearchParams в клиентском компоненте требует границы Suspense —
    // без неё Next выключает статический пререндер всей страницы.
    <Suspense fallback={null}>
      <ActivateView />
    </Suspense>
  );
}
