'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { Button, CartIcon, Section, TelegramIcon } from '@/components/ui';
import { useBuyBlockQuery } from '@/store/api/k30Api';

import classes from './BuySection.module.scss';

export const BuySection: FC = () => {
  const { data } = useBuyBlockQuery();

  const hasLinks = Boolean(data?.telegram_url || data?.yandex_market_url);
  if (!data?.is_enabled || !hasLinks) return null;

  return (
    <Section id="buy">
      <Reveal className={classes.card}>
        <div className={classes.text}>
          <h2 className={classes.title}>{data.title}</h2>
          {data.text && <p className={classes.description}>{data.text}</p>}
        </div>

        <div className={classes.actions}>
          {data.yandex_market_url && (
            <Button href={data.yandex_market_url} external size="large">
              <CartIcon size={18} />
              Яндекс Маркет
            </Button>
          )}

          {data.telegram_url && (
            <Button
              href={data.telegram_url}
              external
              size="large"
              variant="outlined"
            >
              <TelegramIcon size={18} />
              Телеграм
            </Button>
          )}
        </div>
      </Reveal>
    </Section>
  );
};
