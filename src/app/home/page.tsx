import React from 'react';

import { BuySection } from './_components/BuySection/BuySection';
import { FaqSection } from './_components/FaqSection/FaqSection';
import { HeroSection } from './_components/HeroSection/HeroSection';
import { HowSection } from './_components/HowSection/HowSection';
import { ServicesMarquee } from './_components/ServicesMarquee/ServicesMarquee';
import { ServicesSection } from './_components/ServicesSection/ServicesSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesMarquee />
      <ServicesSection />
      <BuySection />
      <HowSection />
      <FaqSection />
    </>
  );
}
