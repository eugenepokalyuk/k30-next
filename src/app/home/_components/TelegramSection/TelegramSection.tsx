'use client';

import React, { FC } from 'react';

import { Button, CalloutCard, Section, TelegramIcon } from '@/components/ui';
import { useTelegramBlockQuery } from '@/store/api/k30Api';

interface Props {
  className?: string;
}

export const TelegramSection: FC<Props> = ({ className }) => {
  const { data } = useTelegramBlockQuery();

  if (!data?.is_enabled || !data.url) return null;

  return (
    <Section id="telegram" className={className}>
      <CalloutCard
        overline="Телеграм-канал"
        title={data.title}
        text={data.text}
        items={data.items}
      >
        <Button href={data.url} external size="large">
          <TelegramIcon size={18} />
          Перейти в канал
        </Button>
      </CalloutCard>
    </Section>
  );
};
