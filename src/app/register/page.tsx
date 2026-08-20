import React from 'react';
import type { Metadata } from 'next';

import { RegisterView } from './_components/RegisterView/RegisterView';

export const metadata: Metadata = {
  title: 'Регистрация',
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <RegisterView />;
}
