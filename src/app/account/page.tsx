import React from 'react';
import type { Metadata } from 'next';

import { AccountView } from './_components/AccountView/AccountView';

export const metadata: Metadata = {
  title: 'Личный кабинет',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
