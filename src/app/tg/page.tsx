import React from 'react';
import type { Metadata } from 'next';

import { TgRedirect } from './TgRedirect';

export const metadata: Metadata = {
  title: 'K30',
  robots: { index: false, follow: false },
};

export default function TgRedirectPage() {
  return <TgRedirect />;
}
