import React from 'react';
import type { Metadata } from 'next';

import { LegalView } from '../_components/LegalView/LegalView';

export const metadata: Metadata = {
  title: 'Пользовательское соглашение',
};

export default function TermsPage() {
  return <LegalView slug="terms" fallbackTitle="Пользовательское соглашение" />;
}
