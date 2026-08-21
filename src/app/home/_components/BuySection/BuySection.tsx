'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { Button, CartIcon, Section, TelegramIcon } from '@/components/ui';
import { useSiteSettings } from '@/lib/hooks';

import classes from './BuySection.module.scss';

/** Блок «Купить ключ»: куда идти за ключом, если его ещё нет.
 *
 *  Своей оплаты у витрины нет — ключи продаются на Яндекс Маркете и в
 *  телеграме. Заголовок, подпись и обе ссылки приезжают из админки:
 *  адрес витрины на Маркете длинный, с метками, и меняется он чаще, чем
 *  выходят релизы.
 *
 *  Блок целиком снимается галкой в админке — например, пока склад пуст.
 *  Ссылки тоже показываются поштучно: остался один канал продаж — будет
 *  одна кнопка, а не вторая, ведущая в никуда.
 */
export const BuySection: FC = () => {
  const {
    buy_is_enabled,
    buy_title,
    buy_text,
    buy_telegram_url,
    buy_yandex_market_url,
  } = useSiteSettings();

  const hasLinks = Boolean(buy_telegram_url || buy_yandex_market_url);
  if (!buy_is_enabled || !hasLinks) return null;

  return (
    <Section id="buy">
      <Reveal className={classes.card}>
        <div className={classes.text}>
          <h2 className={classes.title}>{buy_title}</h2>
          {buy_text && <p className={classes.description}>{buy_text}</p>}
        </div>

        <div className={classes.actions}>
          {buy_yandex_market_url && (
            <Button href={buy_yandex_market_url} external size="large">
              <CartIcon size={18} />
              Яндекс Маркет
            </Button>
          )}

          {buy_telegram_url && (
            <Button
              href={buy_telegram_url}
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
