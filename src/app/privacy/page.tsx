import React from 'react';
import type { Metadata } from 'next';

import { LegalView } from '../_components/LegalView/LegalView';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
};

export default function PrivacyPage() {
  return (
    <LegalView slug="privacy" fallbackTitle="Политика конфиденциальности" />
  );
}
