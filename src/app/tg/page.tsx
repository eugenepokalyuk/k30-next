import React from 'react';
import type { Metadata } from 'next';

import { InformerSlider } from './_components/InformerSlider/InformerSlider';
import { TgActions } from './_components/TgActions/TgActions';
import { TgAdvantages } from './_components/TgAdvantages/TgAdvantages';
import { ServicesSection } from '../home/_components/ServicesSection/ServicesSection';
import { TelegramSection } from '../home/_components/TelegramSection/TelegramSection';

export const metadata: Metadata = {
  title: 'Telegram',
  robots: { index: false, follow: false },
};

export default function TelegramPage() {
  return (
    <>
      <InformerSlider />
      <TelegramSection />
      <TgActions />
      <ServicesSection />
      <TgAdvantages />
    </>
  );
}
