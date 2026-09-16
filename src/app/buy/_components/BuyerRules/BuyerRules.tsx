'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { getBlockIcon, Section } from '@/components/ui';
import { useBuyerRulesQuery } from '@/store/api/k30Api';

import classes from './BuyerRules.module.scss';

export const BuyerRules: FC = () => {
  const { data } = useBuyerRulesQuery();

  if (!data?.is_enabled || !data.items.length) return null;

  return (
    <Section overline="Условия" title={data.title} description={data.text}>
      <ul className={classes.grid}>
        {data.items.map((item, index) => {
          const Icon = getBlockIcon(item.icon);

          return (
            <Reveal
              as="li"
              key={item.id}
              className={classes.item}
              delay={Math.min(index * 0.06, 0.24)}
            >
              <span className={classes.icon}>
                <Icon size={20} />
              </span>

              <div className={classes.text}>
                <p className={classes.title}>{item.title}</p>
                <p className={classes.description}>{item.description}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
};
