import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { LoginView } from './_components/LoginView/LoginView';

export const metadata: Metadata = {
  title: 'Вход',
  robots: { index: false, follow: true },
};

/** `useSearchParams` внутри требует границы ожидания, иначе экспорт не соберётся */
export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
