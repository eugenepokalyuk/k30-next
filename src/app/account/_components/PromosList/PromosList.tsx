'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Button, CheckIcon, CopyIcon, Notice } from '@/components/ui';
import type { OfferedPromoDto } from '@/store/api/types';
import { Routes } from '@/utils/consts';
import { formatDate } from '@/utils/helpers';

import classes from './PromosList.module.scss';

interface Props {
  promos: OfferedPromoDto[];
}

export const PromosList: FC<Props> = ({ promos }) => {
  if (!promos.length) {
    return (
      <Notice tone="info" title="Промокодов пока нет">
        Здесь появятся коды, которые мы выдадим лично вам. Код из рассылки
        или от друга вводится сразу на странице оформления заказа
      </Notice>
    );
  }

  return (
    <div className={classes.list}>
      {promos.map((promo) => (
        <PromoRow key={promo.code} promo={promo} />
      ))}

      <p className={classes.note}>
        Код вводится на странице оформления заказа. Промокод и бонусы не
        суммируются — применится что-то одно
      </p>
    </div>
  );
};

const PromoRow: FC<{ promo: OfferedPromoDto }> = ({ promo }) => {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className={classes.item}>
      <span className={classes.code}>{promo.code}</span>

      <span className={classes.text}>
        <span className={classes.discount}>{promo.label}</span>
        <span className={classes.meta}>{terms(promo)}</span>
      </span>

      <button
        type="button"
        className={clsx(classes.action, copied && classes.copied)}
        onClick={copy}
        aria-label={copied ? 'Код скопирован' : 'Скопировать код'}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? 'done' : 'idle'}
            className={classes.glyph}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: duration.fast, ease }}
          >
            {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          </motion.span>
        </AnimatePresence>
      </button>

      <Button
        href={Routes.Buy}
        size="small"
        variant="outlined"
        className={classes.buy}
      >
        Выбрать подписку
      </Button>
    </div>
  );
};

const terms = (promo: OfferedPromoDto): string =>
  [
    promo.ends_at ? `действует до ${formatDate(promo.ends_at)}` : '',
    promo.uses_left !== null ? `осталось применений: ${promo.uses_left}` : '',
  ]
    .filter(Boolean)
    .join(' · ') || 'без ограничения по сроку';
