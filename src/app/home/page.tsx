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
      {/* Лента сразу под первым экраном: она отвечает на «а что у вас
          вообще есть» раньше, чем до этого вопроса дойдёт секция ниже. */}
      <ServicesMarquee />
      <ServicesSection />
      {/* Сразу после списка сервисов: цену человек уже увидел, и
          следующий его вопрос — «где взять ключ». */}
      <BuySection />
      <HowSection />
      <FaqSection />
    </>
  );
}
