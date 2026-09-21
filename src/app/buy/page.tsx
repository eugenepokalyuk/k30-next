import React from 'react';
import type { Metadata } from 'next';

import { BuyerRules } from './_components/BuyerRules/BuyerRules';
import { ServicePicker } from './_components/ServicePicker/ServicePicker';

export const metadata: Metadata = {
  title: 'Купить подписку',
  description:
    'Выберите сервис и тариф: ChatGPT, Claude, Gemini, Grok, Perplexity. ' +
    'Ключ приходит после оплаты, активация занимает пару минут',
};

export default function BuyPage() {
  return (
    <>
      <ServicePicker />
      <BuyerRules />
    </>
  );
}
