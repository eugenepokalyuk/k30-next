'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import {
  ArrowRightIcon,
  Button,
  CartIcon,
  TelegramIcon,
} from '@/components/ui';
import { useActivationPromoQuery } from '@/store/api/k30Api';

import classes from './SuccessPromo.module.scss';

const MARK_SIZE = 44;

export const SuccessPromo: FC = () => {
  const { data } = useActivationPromoQuery();

  if (!data?.is_enabled) return null;

  const hasTelegram = Boolean(data.telegram_url);
  const hasReview = Boolean(data.review_url);

  if (!hasTelegram && !hasReview) return null;

  // Вторую карточку выключают в админке, и оставшаяся не должна жаться
  // в половину строки с пустотой рядом
  const single = hasTelegram !== hasReview;

  return (
    <div className={clsx(classes.promo, { [classes.single]: single })}>
      {hasTelegram && (
        <article className={classes.card}>
          <div className={classes.head}>
            <Mark
              icon={data.telegram_icon}
              className={classes.telegram_mark}
            >
              <TelegramIcon size={22} className={classes.telegram_glyph} />
            </Mark>

            <p className={classes.text}>{data.telegram_text}</p>
          </div>

          <Button
            href={data.telegram_url}
            external
            size="small"
            fullWidth
            className={classes.action}
          >
            {data.telegram_button_label}

            <ArrowRightIcon size={18} />
          </Button>
        </article>
      )}

      {hasReview && (
        <article className={classes.card}>
          <div className={classes.head}>
            <Mark icon={data.review_icon} className={classes.market_mark}>
              <CartIcon size={22} />
            </Mark>

            <p className={classes.text}>{data.review_text}</p>
          </div>

          <Button
            href={data.review_url}
            external
            size="small"
            fullWidth
            className={clsx(classes.market_button, classes.action)}
          >
            {data.review_button_label}
            <ArrowRightIcon size={18} />
          </Button>
        </article>
      )}
    </div>
  );
};

interface MarkProps {
  /** Адрес картинки из админки */
  icon: string | null;
  /** Заливка запасного знака */
  className: string;
  children: React.ReactNode;
}

const Mark: FC<MarkProps> = ({ icon, className, children }) =>
  icon ? (
    <span className={clsx(classes.mark, classes.uploaded)}>
      <Image
        src={icon}
        alt=""
        width={MARK_SIZE}
        height={MARK_SIZE}
        className={classes.image}
      />
    </span>
  ) : (
    <span className={clsx(classes.mark, className)}>{children}</span>
  );
