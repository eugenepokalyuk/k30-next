'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { getBlockIcon, Section } from '@/components/ui';
import { useAdvantagesQuery } from '@/store/api/k30Api';

import classes from './AdvantagesSection.module.scss';

export const AdvantagesSection: FC = () => {
  const { data } = useAdvantagesQuery();

  if (!data?.length) return null;

  return (
    <Section overline="Преимущества" title="Почему выбирают нас">
      <ul className={classes.grid}>
        {data.map((item, index) => {
          const Icon = getBlockIcon(item.icon);

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
    </Section>
  );
};
