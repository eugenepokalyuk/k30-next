'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { CheckIcon, CopyIcon, Notice } from '@/components/ui';
import { useMyReferralsQuery } from '@/store/api/k30Api';
import type { ReferralsDto } from '@/store/api/types';
import { formatDate, formatPrice } from '@/utils/helpers';

import classes from './ReferralCard.module.scss';

export const ReferralCard: FC = () => {
  const { data, isLoading, isError } = useMyReferralsQuery();

  if (isLoading) {
    return <p className={classes.loading}>Загружаем реферальную программу</p>;
  }

  if (isError) {
    return (
      <Notice tone="error" title="Не получилось загрузить раздел">
        Обновите страницу или напишите в поддержку
      </Notice>
    );
  }

  if (!data?.is_enabled) {
    return (
      <Notice tone="info" title="Программа сейчас выключена">
        Как только мы её включим, здесь появятся ваша ссылка и бонусный счёт
      </Notice>
    );
  }

  return (
    <section className={classes.section}>
      <h2 className={classes.section_title}>{data.title || 'Приглашения'}</h2>

      <div className={classes.card}>
        {data.text && <p className={classes.text}>{data.text}</p>}

        <LinkRow link={data.link} />

        <div className={classes.stats}>
          <Stat label="Бонусов на счету" value={formatPrice(data.balance) ?? '0 ₽'} />
          <Stat label="Пришло по ссылке" value={String(data.invited_count)} />
          <Stat label="Из них купили" value={String(data.friends_with_purchase)} />
        </div>

        <Tiers data={data} />

        <Friends data={data} />

        <History data={data} />
      </div>
    </section>
  );
};

const LinkRow: FC<{ link: string }> = ({ link }) => {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className={classes.link_row}>
      <span className={classes.link}>{link}</span>

      <button
        type="button"
        className={clsx(classes.action, copied && classes.copied)}
        onClick={copy}
        aria-label={copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
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
    </div>
  );
};

const Stat: FC<{ label: string; value: string }> = ({ label, value }) => (
  <p className={classes.stat}>
    <span className={classes.stat_value}>{value}</span>
    <span className={classes.stat_label}>{label}</span>
  </p>
);

const Tiers: FC<{ data: ReferralsDto }> = ({ data }) => {
  if (!data.tiers.length) return null;

  return (
    <ul className={classes.tiers}>
      {data.tiers.map((tier) => (
        <li
          key={tier.friends}
          className={clsx(classes.tier, tier.reached && classes.tier_reached)}
        >
          <span className={classes.tier_icon}>
            {tier.reached ? <CheckIcon size={14} /> : tier.friends}
          </span>

          <span className={classes.tier_text}>
            {tier.friends} друзей с покупкой
            <span className={classes.tier_amount}>
              +{formatPrice(tier.amount)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

const Friends: FC<{ data: ReferralsDto }> = ({ data }) => {
  if (!data.invited.length) {
    return (
      <Notice tone="info" title="Пока никто не пришёл">
        {data.tiers.length
          ? 'Отправьте ссылку — награда придёт, когда друзья дойдут до покупки'
          : 'Отправьте ссылку — друзья, дошедшие до покупки, появятся здесь'}
      </Notice>
    );
  }

  return (
    <ul className={classes.friends}>
      {data.invited.map((friend) => (
        <li key={friend.email + friend.joined_at} className={classes.friend}>
          <span className={classes.friend_email}>{friend.email}</span>

          <span
            className={clsx(
              classes.friend_state,
              friend.has_purchase && classes.friend_paid,
            )}
          >
            {friend.has_purchase
              ? `купил · +${formatPrice(friend.earned)}`
              : 'пока без покупки'}
          </span>
        </li>
      ))}
    </ul>
  );
};

const History: FC<{ data: ReferralsDto }> = ({ data }) => {
  if (!data.entries.length) return null;

  return (
    <div className={classes.history}>
      <p className={classes.history_title}>История бонусов</p>

      <ul className={classes.entries}>
        {data.entries.map((entry) => (
          <li key={entry.created_at + entry.amount} className={classes.entry}>
            <span className={classes.entry_text}>
              {entry.comment || entry.reason}
              <span className={classes.entry_date}>
                {formatDate(entry.created_at)}
              </span>
            </span>

            <span
              className={clsx(
                classes.entry_amount,
                Number(entry.amount) < 0 ? classes.minus : classes.plus,
              )}
            >
              {Number(entry.amount) < 0 ? '−' : '+'}
              {formatPrice(String(Math.abs(Number(entry.amount))))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
