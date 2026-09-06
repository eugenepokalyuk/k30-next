'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import {
  BoltIcon,
  CartIcon,
  ChatIcon,
  CheckIcon,
  KeyIcon,
  RefreshIcon,
  ShieldIcon,
  SupportIcon,
} from '@/components/ui';
import { useAdvantagesQuery } from '@/store/api/k30Api';

import classes from './AdvantagesSection.module.scss';

const icons: Record<string, FC<{ size?: number; className?: string }>> = {
  bolt: BoltIcon,
  shield: ShieldIcon,
  refresh: RefreshIcon,
  support: SupportIcon,
  key: KeyIcon,
  check: CheckIcon,
  chat: ChatIcon,
  cart: CartIcon,
};

export const AdvantagesSection: FC = () => {
  const { data } = useAdvantagesQuery();

  if (!data?.length) return null;

  return (
    <section className={classes.section}>
      <div className={classes.container}>
        <ul className={classes.grid}>
          {data.map((item, index) => {
            const Icon = icons[item.icon] ?? BoltIcon;

            return (
              <Reveal
                as="li"
                key={item.id}
                className={classes.item}
                delay={Math.min(index * 0.06, 0.24)}
              >
                <span className={classes.icon}>
                  <Icon size={22} />
                </span>

                <div className={classes.text}>
                  <p className={classes.title}>{item.title}</p>
                  <p className={classes.description}>{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
