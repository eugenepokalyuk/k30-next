import React from 'react';

import { AdvantagesSection } from './_components/AdvantagesSection/AdvantagesSection';
import { BuySection } from './_components/BuySection/BuySection';
import { FaqSection } from './_components/FaqSection/FaqSection';
import { HeroSection } from './_components/HeroSection/HeroSection';
import { HowSection } from './_components/HowSection/HowSection';
import { ServicesMarquee } from './_components/ServicesMarquee/ServicesMarquee';
import { ServicesSection } from './_components/ServicesSection/ServicesSection';
import { TelegramHomeRedirect } from './_components/TelegramHomeRedirect/TelegramHomeRedirect';
import { TelegramSection } from './_components/TelegramSection/TelegramSection';

export default function HomePage() {
  return (
    <>
      <TelegramHomeRedirect />

      <HeroSection />
      <ServicesMarquee />
      <ServicesSection />
      <AdvantagesSection />
      <BuySection />
      <HowSection />
      <FaqSection />
      <TelegramSection />
    </>
  );
}
