import React from 'react';
import type { Metadata } from 'next';

import { LoginView } from './_components/LoginView/LoginView';

export const metadata: Metadata = {
  title: 'Вход',
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginView />;
}
