import React from 'react';
import type { Metadata } from 'next';

import { Button, Section } from '@/components/ui';
import { Routes } from '@/utils/consts';

import classes from './page.module.scss';

export const metadata: Metadata = {
  title: 'Все сервисы',
  robots: { index: false, follow: true },
};

export default function ServicesPage() {
  return (
    <Section
      overline="Каталог"
      title="Страница в разработке"
      description="Собираем полный каталог сервисов и тарифов. Пока всё, что есть в продаже, показано на главной."
      centered
    >
      <div className={classes.actions}>
        <Button href={Routes.Services} variant="outlined">
          Вернуться к сервисам
        </Button>
      </div>
    </Section>
  );
}
